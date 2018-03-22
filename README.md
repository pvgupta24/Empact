# Empact
**Empact** is an **intelligent video conferencing** app which **recognises emotions** of users in **real time**. These emotions' data are sent to the speaker and displayed in the form of a chart. The speaker can then extract **important insights** from these charts and receive **constructive feedback**. This will help the speaker to **improve content** and help users get **personalised attention** too. 

### Running the Application
* Start MongoDB
* Clone the repo
* ```npm install``` to install API dependencies and `npm start` to start the server API's.
* Open a new terminal and navigate to the `client` directory, `npm install` to setup the Angular dependencies, and `npm start` to start the local development server which auto loads the changes in frontend.
Use the following commands if changes are not served automatically
```
sudo sysctl fs.inotify.max_user_watches=524288
sudo sysctl -p --system
```
* Open http://localhost:4200 to see the application in production.

### Deployment
* In client subdirectory use `ng build` to use angular cli to build the website.
* In the root directory use `npm start` and start the server.
* Open http://localhost:3000 to see the live application.


### Demo
- Video Link : https://www.youtube.com/watch?v=zXlO3CSY_jE
- Presentation Link : https://1drv.ms/p/s!AlCM_gUyvQVGiAHF2tQoze8F3Z0A
- App Here : https://empact.westus2.cloudapp.azure.com:3000/

### Future Work:
- Private Discussion rooms
- Personalised Intelligent Bot
- Detailed report on the emotions of each user at the video conference

### Contributors

Team Snorlax

- Praveen Kumar Gupta
- Shashank P
- Mishal Shah
