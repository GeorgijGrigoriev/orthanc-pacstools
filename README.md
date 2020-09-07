# orthanc-pacstools

A simple web application to manage Orthanc modalities in database.

## What nedeed to run:
* Orthanc server
* ServeFolders plugin
* ModalitiesInDatabase option in Orthanc config is switched to true

## How-to use:
1. Download files from this repository
2. Place it in any folder (like /home/%user%/www/pacstools)
3. Create a section in Orthanc config file like:
  ServeFolders : {
  "/pacstools" : "/home/%user%/www/pacstools"
  },
4. Browse to http://<Orthanc IP>:8042/pacstools/index.html
