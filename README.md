# Creating a Simple Blockchain
In this project, we will build a simple private blockchain using Javascript and Express.

# What problem will you solve implementing this private Blockchain application?
Your employer is trying to make a proof of concept on how a Blockchain application can be implemented in his company.
He is an astronomy fan and because of that he spends most of his free time searching stars in the sky, that's why he wants to create a test application that allows him and his friends to register stars, and track the ownership of each.

# What steps are needed to implement your employers application?
1. The application will create a Genesis Block when we run the application.
2. The user will request the application to send a message to be signed using a Wallet and in this way verify the ownership over the wallet address. The message format will be:
**<WALLET_ADRESS>:${new Date().getTime().toString().slice(0,-3)}:starRegistry;**
3. Once the user has the message they can use a Wallet (Electrum or Bitcoin Core for example) to sign the message.
4. The user will try to submit the Star object for that. The submission will consist of: wallet address, message, signature and the star object with the star information.
5. The application will verify if the time elapsed from the request ownership (the time is contained in the message) and the time when you submit the star is less than 5 minutes.
6. If everything is okay the star information will be stored in the block and added to the chain encoding the Star information.
7. The application will allow us to retrieve the Star objects belong to an owner (wallet address). This information should be human readable so it shouldn't be encoded.

# Testing
Testing steps can be previewed in screenshots folder. We will use **INSOMNIA** to send GET and POST requests to our server.