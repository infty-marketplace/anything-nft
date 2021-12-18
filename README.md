<div align="center">
<h1>
    Infty Marketplace 
    
    
</h1>
<a href='http://infty.market' style='display:block'>
    <img src='https://i.giphy.com/2AsUh6drRSF8bBQ1Zv.gif' /></a>

![GitHub language count](https://img.shields.io/github/languages/count/InfTkm/anything-nft)
![GitHub top language](https://img.shields.io/github/languages/top/inftkm/anything-nft?color=42b883)
![GitHub issues](https://img.shields.io/github/issues/inftkm/anything-nft)
![GitHub commit activity](https://img.shields.io/github/commit-activity/y/inftkm/anything-nft)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

![GitHub contributors](https://img.shields.io/github/contributors/inftkm/anything-nft)
![Website](https://img.shields.io/website?url=http%3A%2F%2Finfty.market)
![GitHub Repo stars](https://img.shields.io/github/stars/inftkm/anything-nft?style=social)

</div>

<details open="open">
<summary>Table of Contents</summary>

- [About](#about)
  - [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Usage](#usage)
    - [With Docker](#with-docker)
    - [With NPM](#with-npm)
    - [Development Mode](#development-mode)
    - [Last step](#last-step)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Acknowledgements](#acknowledgements)
- [License](#license)

</details>

## About

Conflux Program - BeiDou - Team CutoffX  
BeiDou (北斗) is a blockchain entrepreneurship camp hosted by the Shanghai Tree Map Blockchain Research Institute and the Conflux Blockchain Foundation.

In this hackathon-ish event, a group of six UofT graduates completed this project, Infty.

Infty is an easy-to-use NFT trading platform on the Conflux blockchain, with a variety of features, including raffles, fractional trading, staking, and more to add.

### Built With

-   [Conflux Blockchain](https://confluxnetwork.org/)
-   Vue.js + Express.js + MongoDB
-   Solidity

Note: the database currently used is publicly accessible, and only used for testing purposes.

## Getting Started

### Prerequisites

-   [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) / [docker](docker.com)
-   clone the repo and the submodules into the your local computer
-   **Ask the team for the .env file**

### Usage

#### With Docker

```
docker build -t infty
docker run -p 3001:3001 infty
```

#### With NPM

```
cd infty && npm i && npm run build
rm -rf ../backend/src/views && cp -r dist/* ../backend/src/views/
cd ../backend && npm i && node src/index.js
```

#### Development Mode

Run two terminals. Also, need to change the variable `apiUrl` in [store.js](infty/src/store.js) to `http://localhost:3001/api`.

Terminal 1 (front end running at port 8080):

```
cd infty && npm i && npm run serve
```

Terminal 2 (backend running at port 3001):

```
cd backend && npm i && node src/index.js
```

#### Last step

Then launch http://localhost:3001.
It's also deployed at http://infty.market.

## Roadmap

See the [open issues](https://github.com/inftkm/anything-nft/issues) for a list of proposed features (and known issues).

-   [Top Feature Requests](https://github.com/inftkm/anything-nft/issues?q=label%3Aenhancement+is%3Aopen+sort%3Areactions-%2B1-desc) (Add your votes using the 👍 reaction)
-   [Top Bugs](https://github.com/inftkm/anything-nft/issues?q=is%3Aissue+is%3Aopen+label%3Abug+sort%3Areactions-%2B1-desc) (Add your votes using the 👍 reaction)
-   [Newest Bugs](https://github.com/inftkm/anything-nft/issues?q=is%3Aopen+is%3Aissue+label%3Abug)

## Contributing

Due to school or work, the original team members may not be able to contribute as much after the end of the program, but at Conflux, we have a strong community.
Thanks for taking the time to contribute! Contributions are what makes the open-source community such an amazing place to learn, inspire, and create. Any contributions you make will benefit everybody else and are **greatly appreciated**.

Please try to create bug reports that are:

-   _Reproducible._ Include steps to reproduce the problem.
-   _Specific._ Include as much detail as possible: which version, what environment, etc.
-   _Unique._ Do not duplicate existing opened issues.
-   _Scoped to a Single Bug._ One bug per report.

You could use [markdownlint-cli](https://github.com/igorshubovych/markdownlint-cli) to check for common markdown style inconsistency.

## Acknowledgements

Thanks to the following open-source resources:
https://github.com/Synthetixio/synthetix/blob/develop/contracts/StakingRewards.sol

## License

This codebase is distributed under **GPL v3 license**.

See [LICENSE](LICENSE) for more information.
