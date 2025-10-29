import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.76.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Starting reward distribution...')

    // Get pool configuration
    const { data: poolConfig, error: poolError } = await supabaseClient
      .from('pool_config')
      .select('*')
      .single()

    if (poolError) {
      console.error('Error fetching pool config:', poolError)
      throw poolError
    }

    console.log('Pool config:', poolConfig)

    // Get all stakers with positive staked amounts
    const { data: stakers, error: stakersError } = await supabaseClient
      .from('staking')
      .select('*')
      .gt('staked_amount', 0)

    if (stakersError) {
      console.error('Error fetching stakers:', stakersError)
      throw stakersError
    }

    if (!stakers || stakers.length === 0) {
      console.log('No active stakers found')
      return new Response(
        JSON.stringify({ message: 'No active stakers', count: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Found ${stakers.length} active stakers`)

    // Calculate and distribute rewards
    const APR = poolConfig.apr_rate / 100 // 150% APR
    const timeInYear = 365 * 24 * 60 // Total minutes in a year
    const rewardInterval = 5 // 5 minutes
    let totalDistributed = 0
    const updates = []
    const transactions = []

    for (const staker of stakers) {
      // Calculate reward: (staked_amount * APR * interval) / year
      const reward = (parseFloat(staker.staked_amount) * APR * rewardInterval) / timeInYear
      
      if (reward > 0 && poolConfig.total_pool_size >= reward) {
        const newRewards = parseFloat(staker.claimable_rewards) + reward
        
        updates.push({
          id: staker.id,
          claimable_rewards: newRewards
        })

        transactions.push({
          user_id: staker.user_id,
          wallet_address: staker.wallet_address,
          transaction_type: 'reward',
          amount: reward
        })

        totalDistributed += reward
        console.log(`Rewarding user ${staker.wallet_address}: ${reward.toFixed(6)} $FUND`)
      }
    }

    if (totalDistributed === 0) {
      console.log('No rewards to distribute or pool depleted')
      return new Response(
        JSON.stringify({ message: 'Pool depleted or no rewards to distribute', totalDistributed: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if pool has enough tokens
    if (poolConfig.total_pool_size < totalDistributed) {
      console.log('Insufficient pool balance')
      return new Response(
        JSON.stringify({ message: 'Insufficient pool balance', required: totalDistributed, available: poolConfig.total_pool_size }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Update staking records
    for (const update of updates) {
      const { error: updateError } = await supabaseClient
        .from('staking')
        .update({ claimable_rewards: update.claimable_rewards })
        .eq('id', update.id)

      if (updateError) {
        console.error('Error updating staker:', updateError)
      }
    }

    // Insert transaction records
    const { error: transError } = await supabaseClient
      .from('transactions')
      .insert(transactions)

    if (transError) {
      console.error('Error inserting transactions:', transError)
    }

    // Update pool size
    const newPoolSize = poolConfig.total_pool_size - totalDistributed
    const { error: poolUpdateError } = await supabaseClient
      .from('pool_config')
      .update({ 
        total_pool_size: newPoolSize,
        last_reward_distribution: new Date().toISOString()
      })
      .eq('id', poolConfig.id)

    if (poolUpdateError) {
      console.error('Error updating pool:', poolUpdateError)
    }

    console.log(`Successfully distributed ${totalDistributed.toFixed(6)} $FUND to ${updates.length} stakers`)
    console.log(`Remaining pool size: ${newPoolSize.toFixed(2)} $FUND`)

    return new Response(
      JSON.stringify({ 
        success: true,
        totalDistributed: totalDistributed.toFixed(6),
        stakersRewarded: updates.length,
        remainingPool: newPoolSize.toFixed(2)
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: any) {
    console.error('Error distributing rewards:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})