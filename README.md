# WS service example for Equilibrium API

WS nodejs service demonstrating equilab api usage

## Installation

Please use yarn for resolutioins to work properly. Install dependencies

```
$ yarn
```

## Set up seed

To run service you should specify seed phrase for transaction signing.

Create `.env` with `SEED_PHRASE` (and optional `CHAIN_NODE` and `PORT` variables)

```
cat .env
SEED_PHRASE="lock idea vague ordinary pool stuff summer whale fame laptop assist lock"
CHAIN_NODE="wss://devnet.genshiro.io"
PORT="9000"
```

## Run service

Run service in dev mode

```
$ yarn dev
```

Use `yarn build` and `yarn start` to compile and start compiled script

## Create seed

To create seed send `createSeed` message

```
{
    "action": "createSeed"
}
```

Service will return id for message immediately and seed phrase when seed generation is completed

```
{"id":"16450141501591","message":{"action":"createSeed"}}
{"id":"16450141501591","message":"copy library roast cover lecture execute domain anger gather midnight immune abandon"}
```

## Get latest block header

Send `getLatestBlockHead` message to service

```
{
    "action": "getLatestBlockHead"
}
```

Service will respond

```
{"id":"16450147724133","message":{"action":"getLatestBlockHead"}}
{"id":"16450147724133","message":{"parentHash":"0x394dc596fbe6f31ee12df4e5cb2b24cc1d95a2bb154d63f890eedb9cf1f39312","number":302018,"stateRoot":"0x40aec88c4c97a937985b1b72bf527a3d992710fab41b4341b5055bfa1c7d7470","extrinsicsRoot":"0x304b113bfc2aae2867ebe53559b7ab56dfa7b01ad60d8a592fd27e2da3430a66","digest":{"logs":[{"preRuntime":["0x61757261","0x287d571000000000"]},{"seal":["0x61757261","0x2cf23f01d73dd30940be16adf6b3ac924bffe451e26242fd1e9371cce4f2322a83e5d97d7879765a25a0e6e4949998fe949e5cd5a6f920cb799e60a4defd9581"]}]}}}

```

## Get block events by block number

Send `getBlockEvents` message with `blockNumber`

```
{
    "action": "getBlockEvents",
    "data": {
        "blockNumber": 290000
    }
}
```

You will recieve array of events in block

```
{"id":"16450148681654","message":{"action":"getBlockEvents","data":{"blockNumber":290000}}}

{"id":"16450148681654","message":{"data":[{"phase":{"initialization":null},"event":{"index":"0x0700","data":[29000]},"topics":[]},{"phase":{"applyExtrinsic":0},"event":{"index":"0x0000","data":[{"weight":161650000,"class":"Mandatory","paysFee":"Yes"}]},"topics":[]},{"phase":{"applyExtrinsic":1},"event":{"index":"0x0a00","data":[{"0":6582132},19797000000,19798500000,"cZj5iCJA4k66vtTDbipEdW1fVRae3JYYZNqY6BoduQmcjSwem"]},"topics":[]},{"phase":{"applyExtrinsic":1},"event":{"index":"0x0000","data":[{"weight":912254000,"class":"Operational","paysFee":"Yes"}]},"topics":[]},{"phase":{"applyExtrinsic":2},"event":{"index":"0x0a00","data":[{"0":2019848052},5939100000,5939550000,"cZj5iCJA4k66vtTDbipEdW1fVRae3JYYZNqY6BoduQmcjSwem"]},"topics":[]},{"phase":{"applyExtrinsic":2},"event":{"index":"0x0000","data":[{"weight":912254000,"class":"Operational","paysFee":"Yes"}]},"topics":[]},{"phase":{"applyExtrinsic":3},"event":{"index":"0x0a00","data":[{"0":7041901},174955600000,174955600000,"cZj5iCJA4k66vtTDbipEdW1fVRae3JYYZNqY6BoduQmcjSwem"]},"topics":[]},{"phase":{"applyExtrinsic":3},"event":{"index":"0x0000","data":[{"weight":912254000,"class":"Operational","paysFee":"Yes"}]},"topics":[]},{"phase":{"applyExtrinsic":4},"event":{"index":"0x0a00","data":[{"0":1970496611},999300000,999470000,"cZj5iCJA4k66vtTDbipEdW1fVRae3JYYZNqY6BoduQmcjSwem"]},"topics":[]},{"phase":{"applyExtrinsic":4},"event":{"index":"0x0000","data":[{"weight":912254000,"class":"Operational","paysFee":"Yes"}]},"topics":[]},{"phase":{"applyExtrinsic":5},"event":{"index":"0x0a00","data":[{"0":1751412596},19797000000,19798500000,"cZj5iCJA4k66vtTDbipEdW1fVRae3JYYZNqY6BoduQmcjSwem"]},"topics":[]},{"phase":{"applyExtrinsic":5},"event":{"index":"0x0000","data":[{"weight":912254000,"class":"Operational","paysFee":"Yes"}]},"topics":[]},{"phase":{"applyExtrinsic":6},"event":{"index":"0x0a00","data":[{"0":6648936},3117710000000,3117860000000,"cZj5iCJA4k66vtTDbipEdW1fVRae3JYYZNqY6BoduQmcjSwem"]},"topics":[]},{"phase":{"applyExtrinsic":6},"event":{"index":"0x0000","data":[{"weight":912254000,"class":"Operational","paysFee":"Yes"}]},"topics":[]},{"phase":{"applyExtrinsic":7},"event":{"index":"0x0a00","data":[{"0":2002941027},44295010000000,44297505000000,"cZj5iCJA4k66vtTDbipEdW1fVRae3JYYZNqY6BoduQmcjSwem"]},"topics":[]},{"phase":{"applyExtrinsic":7},"event":{"index":"0x0000","data":[{"weight":912254000,"class":"Operational","paysFee":"Yes"}]},"topics":[]}]}}
```

## Get address balance

Send `getBalance` message with `address` and `token`

```
{
    "action": "getBalance",
    "data": {
        "address": "5GC1gZuBV5YSwgkxjQrPggF2fLhQcAUeAiXnDaBUg6wJPvtK",
        "token": "WBTC"
    }
}
```

Service responds with

```
{"id":"16450150403895","message":{"action":"getBalance","data":{"address":"5GC1gZuBV5YSwgkxjQrPggF2fLhQcAUeAiXnDaBUg6wJPvtK","token":"WBTC"}}}

{"id":"16450150403895","message":{"positive":104999915426}}
```

Balance has 10^9 precision. Divide by 10^9 to get token amount.

### Transfer token

Send `transfer` with `to` address and `token` and `amount`. FROM account is from seed phrase keypair

```
{
    "action": "transfer",
    "data": {
        "to": "5GQohd2NHUJEEwEs4VZPudruM14JUFyusrJg6hF183g8Yewj",
        "token": "WBTC",
        "amount": 1
    }
}
```

Service responds

```
{"id":"16450151807716","message":{"action":"transfer","data":{"to":"5GQohd2NHUJEEwEs4VZPudruM14JUFyusrJg6hF183g8Yewj","token":"WBTC","amount":1}}}

{"id":"16450151807716","message":{"success":true}}
```

Service can respond with error

```
{"id":"16450152140547","message":{"success":false,"error":{"registryErrors":[{"args":[],"docs":[" Wrong margin for operation performing"],"fields":[],"index":9,"method":"WrongMargin","name":"WrongMargin","section":"bailsman"}]}}}
```
