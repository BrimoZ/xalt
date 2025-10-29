import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { walletAddress, tokenMint } = await req.json()

    if (!walletAddress || !tokenMint) {
      throw new Error('Missing required parameters')
    }

    console.log('Checking balance for wallet:', walletAddress)
    console.log('Token mint:', tokenMint)

    // Make RPC call to Helius to get token accounts
    const heliusRpcUrl = 'https://mainnet.helius-rpc.com/?api-key=c6afc762-dee9-4263-b82f-b7d2c94f8f2c'
    
    const response = await fetch(heliusRpcUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getTokenAccountsByOwner',
        params: [
          walletAddress,
          {
            mint: tokenMint,
          },
          {
            encoding: 'jsonParsed',
          },
        ],
      }),
    })

    const data = await response.json()
    console.log('RPC Response:', JSON.stringify(data, null, 2))

    if (data.error) {
      throw new Error(data.error.message || 'RPC error')
    }

    if (!data.result || !data.result.value || data.result.value.length === 0) {
      // No token account found
      return new Response(
        JSON.stringify({ balance: 0, message: 'No token account found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get the token balance
    const tokenAccount = data.result.value[0]
    const balance = tokenAccount.account.data.parsed.info.tokenAmount.uiAmount

    console.log('Token balance:', balance)

    return new Response(
      JSON.stringify({ balance, decimals: tokenAccount.account.data.parsed.info.tokenAmount.decimals }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error checking token balance:', error)
    return new Response(
      JSON.stringify({ error: error.message, balance: 0 }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
