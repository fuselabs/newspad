sudo apt-get update
sudo apt-get install -y python-software-properties python g++ make 
sudo apt-get install -y g++ curl libssl-dev apache2-utils git-core unzip

# installing node re instructions in the documentation
# https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager#ubuntu-mint

sudo add-apt-repository ppa:chris-lea/node.js
sudo apt-get update
sudo apt-get install -y nodejs
sudo apt-get install -y redis-server

# SET UP NEWSPAD
cd /vagrant;npm install express jade redis underscore

##INSTALL SHAREJS 0.6
npm install share@0.6

git clone git@github.com:square/crossfilter.git
wget http://getbootstrap.com/2.3.2/assets/bootstrap.zip; unzip bootstrap.zip
mv bootstrap/js/* /vagrant/public/javascripts/lib/
mv bootstrap/css/* /vagrant/public/stylesheets/
mv bootstrap/img/* /vagrant/public/img/

# Download the Bootstrap-Affix plugin (MIT License)
wget -P /vagrant/public/javascripts/lib/ http://getbootstrap.com/2.3.2/assets/js/bootstrap-affix.js
# Download the Bootstrap-tooltip plugin (MIT License)
wget -P /vagrant/public/javascripts/lib/ http://getbootstrap.com/2.3.2/assets/js/bootstrap-tooltip.js

#Download holder.js (MIT License)
wget http://github.com/imsky/holder/zipball/v2.2.0
mv v2.2.0 holder.js.zip
unzip holder.js.zip
mv imsky-holder-4e4b837/holder.js /vagrant/public/javascripts/lib

# Download Backbone (MIT License)
# from http://http://backbonejs.org/
wget -P /vagrant/public/javascripts/lib/ http://backbonejs.org/backbone-min.js

# Download JQuery (MIT License)
wget -P /vagrant/public/javascripts/lib/ http://code.jquery.com/jquery-2.0.3.min.js

# download Math.uuid.js (public domain)
wget -P /vagrant/public/javascripts/lib/ https://gist.github.com/ne-sachirou/882192/raw/e8a083a4f8322edb44764d724e6e89d6ccd6bf44/Math.uuid.js

# download jquery-scrollto.min.js (MIT License)
# from https://github.com/flesler/jquery.scrollTo
wget -P /vagrant/public/javascripts/lib/ https://raw.github.com/flesler/jquery.scrollTo/master/jquery.scrollTo.min.js

# download jquery.cookie.js (MIT License)
# from https://github.com/carhartl/jquery-cookie
wget -P /vagrant/public/javascripts/lib/ https://raw.github.com/carhartl/jquery-cookie/master/jquery.cookie.js

# download embedly (MIT License)
# from https://github.com/embedly/embedly-jquery
wget -P /vagrant/public/javascripts/lib/ https://raw.github.com/embedly/embedly-jquery/master/jquery.embedly.min.js

# download underscore (MIT License)
# from http://underscorejs.org/
wget -P /vagrant/public/javascripts/lib/ http://underscorejs.org/underscore-min.js


# download expanding textareas (MIT License)
# from https://github.com/bgrins/ExpandingTextareas
wget -P /vagrant/public/javascripts/lib/ https://raw.github.com/bgrins/ExpandingTextareas/master/expanding.js
