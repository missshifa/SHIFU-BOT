**bot run yml 👇🏻👇🏻**
(_____________________)
 ** 𝐀𝐃𝐌𝐈𝐍 𝐒𝐇𝐈𝐅𝐀𝐓 **
$______________________$
    
name: Node.js CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [20.x]
        # See supported Node.js release schedule at https://nodejs.org/en/about/releases/

    steps:
    # Step to check out the repository code
    - uses: actions/checkout@v2

    # Step to set up the specified Node.js version
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v2
      with:
        node-version: ${{ matrix.node-version }}

    # Step to install dependencies
    - name: Install dependencies
      run: npm install

    # Step to run the bot with the correct port
    - name: Start the bot
      env:
        PORT: 8080
      run: npm start

      




1. **build command**:
    ```bash
    npm install
    ```

2. **Start Command**:
    ```bash
    node index.js
    ```

**how to setup voice api**

first open this link

    ```bash
     https://console.cloud.google.com
    ```
1. select project
   “New Project” > project name
   Create

2. open project >  clik 3 line 
   
