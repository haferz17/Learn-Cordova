/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Camera
    document.getElementById('buttonCamera').addEventListener('click', () => {
        navigator.camera.getPicture((s) => {
            document.getElementById('result').setAttribute('src', 'data:image/png;base64, ' + s)
        }, (e) => {
        }, {
            quality: 60,
            cameraDirection: 1,
            destinationType: 0,
            correctOrientation: true
        })
    })

    // BarcodeScannner
    document.querySelector("#buttonScan").addEventListener("touchend", function () {
        cordova.plugins.barcodeScanner.scan(
            function (result) {
                document.getElementById('resultBarcode').setAttribute('value', result.text)
            },
            function (error) {
                alert("Scanning failed: " + error);
            },
            {
                preferFrontCamera: false, // iOS and Android
                showFlipCameraButton: false, // iOS and Android
                showTorchButton: false, // iOS and Android
                torchOn: false, // Android, launch with the torch switched on (if available)
                saveHistory: true, // Android, save scan history (default false)
                prompt: "Place a barcode inside the scan area", // Android
                resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
                formats: "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
                orientation: "potrait", // Android only (portrait|landscape), default unset so it rotates with the device
                disableAnimations: true, // iOS
                disableSuccessBeep: false // iOS and Android
            }
        )
    })

    // Geolocation

    var Latitude = undefined;
    var Longitude = undefined;

    // Get coordinates
    navigator.geolocation.getCurrentPosition(position => {
        Latitude = position.coords.latitude;
        Longitude = position.coords.longitude;
        getMap(Latitude, Longitude);
    }, error => {
        console.log('code: ', error)
    }, {
        enableHighAccuracy: true
    });

    // Get map by using coordinates
    function getMap(latitude, longitude) {
        var mapOptions = {
            center: new google.maps.LatLng(0, 0),
            zoom: 1,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var map = new google.maps.Map(document.getElementById("map"), mapOptions);
        var latLong = new google.maps.LatLng(latitude, longitude);
        var marker = new google.maps.Marker({ position: latLong });

        marker.setMap(map);
        map.setZoom(15);
        map.setCenter(marker.getPosition());
    }
}
