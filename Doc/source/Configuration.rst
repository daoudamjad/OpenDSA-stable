﻿.. _Configuration:

==========================
OpenDSA Configuration File
==========================

----------
Motivation
----------

* Allows content to be environment-independent

  * Configuration file contains all environment-dependent settings such as paths and target URLs
  * Example: If developers want to point their front-end code at different backend systems, they simply make the change in their own config file.  They can share all OpenDSA content, but when they build the book, it will be built using their personalized settings

* Allows easy replication

  * Collects all settings and preferences required to configure an instance of OpenDSA in a single, portable file that can be easily shared among instructors.  
  * Once a configuration has been created, instructors can make identical copies without going through the configuration process

* Allows fine grain control

  * Existing configuration files provide sensible defaults, but allow instructors to control aspects such as how many points a specific exercise is worth or whether it is required for module proficiency 

* Configuration file can be generated by a simple front-end or created by hand (tedious, but possible)


---------------------
Configuration Process
---------------------

Please see the comment at the beginning of configure.py for more information about how the script works.  Keeping the information in the script itself ensures the script is well-documented and makes it easier to maintain the documentation.

* Only the modules listed in the configuration file will be included.  To remove a module from the book, simply remove the module object from the configuration file.  
* To remove an exercise from a module, set the "remove" attribute to true.  Exercises that do not appear in the configuration file will still be included in the book using the default configuration options.  During configuration, a list will be printed of any exercises which were encountered in the modules but not present in the configuration file.


Future Features
===============

* Implement independent source locations for various files rather than basing them all off the OpenDSA root directory or the output directory

  * Allow copies of ODSA.js and khan-exercise.js to be built rather than modifying the originals, but reference AV and Exercise files from OpenDSA root directory
  * Implement support for hosting AVs and exercises on a different domain than modules
  
* Build in config validator that ensures necessary fields appear in the source config file
* Ability to optionally include subsections in an RST file - similar to how we include / exclude exercises


------
Format
------

* OpenDSA configuration files are stored using JSON

  * Easily readable and writeable by both humans and machines
  
    * Easy to create and manipulate using Python and JavaScript
    * Easy to manually edit
    
  * Efficient
  
    * Less verbose than XML resulting in a smaller file size
    
  * Abundance of online JSON validators and formatters

* Book name

  * The name of the configuration file will be used to uniquely identify this instance of OpenDSA in the backend database


Settings (all are required unless otherwise specified)
======================================================

* "title" - the title of the OpenDSA textbook

* "output_dir" - the directory where the textbook materials will be placed

  * Files required to compile the book will be copied / written here, including modified version of the source RST files
  * If 'copy_static_files' is 'true', all files necessary to host an instance of OpenDSA will be contained within this directory
  * The compiled textbook will appear in 'build/html' within this directory
  * This directory must be web accessible
  
* "code_dir" - specifies the directory containing the source code to be used in textbook examples

* "module_origin" - the protocol and domain where the module files are hosted

  * Used by embedded exercises as the target of HTML5 post messages which send information to the parent (module) page
  * Ex: "module_origin": "http://algoviz.org",
  
* "exercise_origin" - the protocol and domain where the AV files are hosted

  * Used on module pages to allow HTML5 post messages from this origin, allows embedded exercises to communicate with the parent module page
  * Ex: "exercise_origin": "http://algoviz.org",
  
* "backend_address" - the protocol and domain (and port number, if not the protocol default) of the backend server which supports centralized user scoring and interaction data collection

  * Trailing '/' is optional
  * Ex: "backend_address": "https://opendsa.cc.vt.edu/",

* "copy_static_files" - a boolean which controls whether or not supplemental (non-built) files should be copied to the output directory

  * Supplemental files include:
  
    * AV
    * Exercises
    * JSAV-min.js and supporting JS and CSS files
    * Khan Academy files
    * lib files
    * SourceCode files
  
  * If the OpenDSA root directory is web accessible, this can be set to false
  * If the OpenDSA root directory is not web accessible or you want the output directory (specified above) to contain all the files necessary to host OpenDSA, set this value to true

* "build_JSAV" - a boolean controlling whether or not the JSAV library should be rebuild every time the configuration file is run

  * This value should be set to false for development
  * Instructors may wish to set this to true for production environments when configuration is run infrequently and JSAV is likely to have changed since the last time configuration occurred

* "build_ODSA" - a boolean controlling whether OpenDSA should be built after the configuration process has occurred

  * This can generally be set to true because in most cases it makes sense to build the book immediately after it is configured
  * If necessary, this value can be set to false and OpenDSA can be built manually by running make from the output directory

* "chapters" - this object contains a hierarchy of chapters, sections, subsections, modules and exercises

  * Each key in "chapters" represents a chapter name, any key values in the associated object represent sections within that chapter.  This concept is applied recursively until a module object is reached.  A module object is one whose key matches the name of an RST file in the ~OpenDSA/RST/source/ directory and which contains the key "exercises".

  * Modules
    
    * The key relating to each module object must correspond with the name of an RST file found in the ~OpenDSA/RST/source/ directory
    * If a module contains no exercises, it should still contain a key "exercises" with a value of an empty object
    
    * "long_name" - a long form, human-readable name used to identify the module in the GUI
    
    * "dispModComp" - (optional) a flag which if set to "true" will force the "Module Complete" message to appear even if the module contains no required exercises, if set to "false", the "Module Complete" message will not appear even if the module DOES contain required exercises
    
    * "exercises" - a collection of exercise objects representing the exercises found in the module's RST file

      * Omitting an exercise from the module's "exercises" object will cause the exercise to be removed from the configured module
      * Each exercise object contains required information about that exercise including:
      
        * "remove" - (optional) if set to true, the exercise will not be included in the module
          
          * This option can only be used with exercises embedded using the 'avembed' directive.  Slideshows and diagrams created using the 'inlineav' directive are considered content and cannot be removed via the configuration file.
          
        * "long_name" - a long form, human-readable name used to identify the exercise in the GUI
        * "required" - whether the exercise is required for module proficiency
        * "points" - the number of points the exercise is worth
        * "threshold" - the percentage a user needs to score on the exercise to obtain proficiency
        * "type" - the exercise type
        
          * "ka" - Khan Academy style exercises
          * "pe" - OpenDSA proficiency exercises
          * "ss" - slideshows
          * "dgm" - JSAV-based diagram
          
      * JSAV-based diagrams do not need to be listed
