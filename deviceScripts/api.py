#!/usr/bin/env python
import time
import os, json
import RPi.GPIO as GPIO
import requests
import datetime
#RasPi device script
GPIO.setmode(GPIO.BCM)
DEBUG = 0

#default ADC code from docs to set up the ADC

# read SPI data from MCP3008 chip, 8 possible adc's (0 thru 7)
def readadc(adcnum, clockpin, mosipin, misopin, cspin):
        if ( (adcnum > 7) or (adcnum < 0) ):
                return -1
        GPIO.output(cspin, True)

        GPIO.output(clockpin, False)  # start clock low
        GPIO.output(cspin, False)     # bring CS low

        commandout = adcnum
        commandout |= 0x18  # start bit + single-ended bit
        commandout <<= 3    # we only need to send 5 bits here
        for i in range(5):
                if (commandout & 0x80):
                        GPIO.output(mosipin, True)
                else:
                        GPIO.output(mosipin, False)
                commandout <<= 1
                GPIO.output(clockpin, True)
                GPIO.output(clockpin, False)

        adcout = 0
        # read in one empty bit, one null bit and 10 ADC bits
        for i in range(12):
                GPIO.output(clockpin, True)
                GPIO.output(clockpin, False)
                adcout <<= 1
                if (GPIO.input(misopin)):
                        adcout |= 0x1

        GPIO.output(cspin, True)

        adcout >>= 1       # first bit is 'null' so drop it
        return adcout

# change these as desired - they're the pins connected from the
# SPI port on the ADC to the Cobbler
SPICLK = 18
SPIMISO = 23
SPIMOSI = 24
SPICS = 25

# set up the SPI interface pins
GPIO.setup(SPIMOSI, GPIO.OUT)
GPIO.setup(SPIMISO, GPIO.IN)
GPIO.setup(SPICLK, GPIO.OUT)
GPIO.setup(SPICS, GPIO.OUT)
# default ADC setup ends

# temperature sensor (TMP36) connected to adc #1
temperature_adc = 1
#RCpin = Capacitor, connected to GPIO 17
RCpin = 17
#define LDR and temp payloads to POST
ldr_payload = {"type": "ldr", "timer": "a", "value":"0"}
temp_payload = {"type": "temp", "timer": "a", "value":"0"}

while True:
        # read the analog pin for temp reading
        analog_temp_value = readadc(temperature_adc, SPICLK, SPIMOSI, SPIMISO, SPICS)

	reading = 0
	GPIO.setup(RCpin, GPIO.OUT)
	GPIO.output(RCpin, GPIO.OUT)
	time.sleep(.1)
	GPIO.setup(RCpin, GPIO.IN)
#capacitor connected to, receives power from LDR
#var reading starts at 0, increases while capacitor has low voltage
#the longer the capacitor takes to charge up, the higher the reading
#if pitch black, capacitor will never charge, var reading will get infinitely big,
#so a max of 500,000 set for reading
	while ((GPIO.input(RCpin) == GPIO.LOW) and reading < 500000):
		reading +=1

#adc gives values between 1-1024, converted to temp using formula from docs
        temp_voltage = (analog_temp_value * 3.3 / 1024.0) * 1000.0;
        temp = (temp_voltage - 500)/10;
#ldr and temp payloads updated with new values
        temp_payload["value"] = temp
        temp_payload["timer"] = time.time()
#time.time returns time in milliseconds since epoch. converted later
#by server into local time
        ldr_payload["value"] = reading
        ldr_payload["timer"] = time.time()

        if DEBUG:
                print "Temperature analog value: ", analog_temp_value
                print "Temperature voltage: ", temp_voltage
                print "Ldr value: ", reading

        print "Temperature: ", temp, "at ", temp_payload["timer"]
        print "Light: ", reading, "at ", ldr_payload["timer"]
        print ""
# new payloads posted to web app
        requests.post('https://stark-sierra-48385.herokuapp.com/api/sensors', data = ldr_payload)
        requests.post('https://stark-sierra-48385.herokuapp.com/api/sensors', data = temp_payload)

# hang out and do nothing for a second to not post values too often
        time.sleep(1)
