# 📍Parking_Helper🚗
A website made using leaflet.js, postgis and postgresql to help find people parking locations in Mumbai Area

## Project Demo
![Demo gif](https://github.com/vdmondkr2002/Parking_Helper/blob/main/parking-helpers-demo.gif?raw=true)

## Features
* Provides a map of Mumbai area with marking on the parking locations got from dataset.
* User can check the nearest parking lots to location through toggle switch.
* A table which has addresses of each location nearest to the area selected.

### Site is live on - https://parking-helpers.herokuapp.com/

## 🛠 Tech Stack 
* **LeafletJS** for web mapping
* **pug** as template engine
* **CSS** for styling

## Local installation-
1. Clone the repository:
  ```
  $ git clone https://github.com/vdmondkr2002/Parking_Helper.git
  ```
2. Install the necessary dependencies-
  ```
  $ cd Parking_Helper
  $ npm install
  ```
3. Setting environment variables-
  * Create a .env file and copy paste contents from .env.example file.
  * Create a postgresql database and table as guided and import the .csv file provided into database 
  * Edit the values of environment variables as directed.
5. Run the server-
  ```
  $ npm start
  ```
