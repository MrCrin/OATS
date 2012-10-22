# OATS  - Online Assessment and Tracking System

Inspired by an outdated physical folder and paper based school assessment
system, OATS is a web browser based collaborative assessment tool for
use in schools. The project is currently being developed for use in
one specific school, the one I work in, but with a mind to making it
easily changed to suit any school. Down the line I plan to make it easy
to 'install' for any school and specific set of needs.

## What's new in this release?

See the CHANGELOG file for information on what's new.

## Installation/Usage

In order for the code here to work you will need a couple of additions

1. A MySQL Database
This can be created using the dbCreate.sql script found at
\install\sql\dbCreate.sql

2. Create a config.php
You need to create \php\config.php

    <?
    $dbServer = "**YOUR SERVER**";
    $dbUsername = "**YOUR USERNAME**";
    $dbPassword = "**YOUR PASSWORD**";
    $dbSelect = "**YOUR DATABASE NAME**";
    ?>

Changing the details to match the details of your database.

3. Dompdf
If you want the print functionality to work then you need dompdf, an
excellent opensource html to pdf convertor. It can be downloaded from
http://eclecticgeek.com/dompdf
The entire contents of the download should be added to the root directory
in which you are running OATS.
DOMPDF_ENABLE_CSS_FLOAT must be set to true for CSS templates to work.

## License

OATS by Michael Crinnion is licensed under the Creative Commons
Attribution-NonCommercial-ShareAlike 3.0 Unported License. To view a copy
of this license, visit http://creativecommons.org/licenses/by-nc-sa/3.0/.