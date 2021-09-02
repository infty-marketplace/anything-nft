// const { Conflux } = require('js-conflux-sdk')
// const { abi, bytecode } = require('./build/contracts/InftyNft.json')
// const testadd = 'cfxtest:aaj7rbyy019hajpa61f7x0hda0gthftyayszjpwy8e'
// const priv = '0xef58599635660cc0c6ed148082b0025d291d4c14102a51dae961f0cfc9d08dc5'


async function main(){
    const cfx = new Conflux({
        url:'https://test.confluxrpc.com',
        networkId: 1
    })
    console.log(await cfx.getEpochNumber())
    const account = cfx.wallet.addPrivateKey(priv)
    const contract = cfx.Contract({abi, address:'cfxtest:acazt4n0rwh9m5bjs81f4c94r5rcfyu3hp04jjvkn8'})
    console.log(await contract.name())
    console.log(await contract.mint(testadd, 'google.com').sendTransaction({from: testadd}).executed() )
}
