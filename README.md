# PrideVel-IoT-RasPi
Using Node.js to graph real-time sensor data from a Raspberry Pi

Summer 2017 IoT project

Created IoT setup to read light and temperature data to help with theft protection and quality control of goods transported in trucks.

A high intensity of light indicates the truck cargo has been opened before reaching its intended destination. If temperature thresholds are exceeded, temperature sensitive food and medical equipment 
may be spoiled.

To make this, I first wired up a photoresistor and temperature sensor to a Raspberry Pi. I then used python to read temperature data from the ADC3008 chip, and
analyzed capacitor data to get light readings. I then created a REST API to send sensor data to the client webpage, and used PostgreSQL to store the data.
Using AngularJS, I then graphed real-time sensor data from the database, with an automatically controlled switch depicting whether light readings exceed normal levels.

