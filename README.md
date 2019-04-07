 # Twitch interview task Project
 This platform provides Twitch live events, streamings and chat.

 ## Design Assumptions

 #### Login Page:
 * It has a Twitch login button
 
 #### Page Header
  * It has Home button and a dropdown buton with user logo & username. Once, we click on that drodown button a  dropdown will appear with a logout option. 

 #### Home Page:

 * There is a search bar underneath the header to search the twitch streamers. The search action performs once user types a username and press search button. From the search list user can mark favorite the users.
 * Below that, there is a list of my favorite streamers in the left side along with the live event block in right side which also has a view streamer button to go to streamer page. Events for first favourite streamer will be listened by deafult, you can change it by clicking on other streamer.

 #### Streamer Page:
 
 * It has user logo with username under the header 
 * Below that, there is live event sidebar in left side (to view the 10 recent events), twitch viedo iframe in middle and twitch chat iframe in right side.


 #### Note: I have implemented two webhooks here.
 * [Follows](https://dev.twitch.tv/docs/api/webhooks-reference/#topic-user-follows) - Notifies when a follows event occurs between two Twitch users.
 * [Streams](https://dev.twitch.tv/docs/api/webhooks-reference/#topic-stream-changed) - Notifies when a stream changes; e.g., stream goes online or offline, the stream title changes, or the game changes.

 ## Questions

##### 1. How would you deploy the above on AWS?
##### Answer:
##### Deployment Architecture Diagram:
 ![image](https://raw.githubusercontent.com/gurvindrasingh/twitch-live-events/master/public/images/deployment-diagram.jpeg)
These are the steps to deploy this app on *AWS*:
 * Create an [EC2 ubuntu instance on AWS](https://us-east-2.console.aws.amazon.com/ec2/v2/home?region=us-east-2#Instances:sort=instanceId). I have used *Ubuntu Server 16.04 LTS (HVM), SSD Volume Type* as this is a *Free tier instance* - Configure Security Group - ssh and http (Https is also required if you are using *SSL*) - Create a new key pair to connect to the EC2 Instance via *SSH*
 * Create an [Amazon RDS Database instance](https://us-east-2.console.aws.amazon.com/rds/home?region=us-east-2#GettingStarted:) - MySQL
 * Connect to ECE instance using ssh:
 ```
 $ sudo ssh -i keypair.pem user@<your public IP>
 ```
 *make sure the keypair.pem file has 400 permissions*
 * Install Apache 2.2 server on EC2 Instance
 * Run Apache 2.2 server:
 ```
 $ sudo service apache2 start
 ```
 * Install PHP 7.2
 * Install PHP Extensions (OpenSSL, PDO, Mbstring, Tokenizer, XML, Ctype, JSON, BCMath, PHP-CURL)
 * Install Curl
 * Install Composer
  * *Restart apache server*
 ```
 $ sudo service apache2 restart
 ```
 * Now you have your server's IP address or domain, enter it into your browser's address bar and you should see the default Ubuntu 16.04 Apache web page with service configuration info.
 
 * Go to the Apache public folder:
 ```
 $ sudo cd /var/www/html
 ```
 * Clone git repository here:
 ```
 $ sudo git clone https://github.com/gurvindrasingh/twitch-live-events.git
 ```
 * Reconfigure Apache server to point to the Laravel directory( twitch-live-events ):
 ```
 $ sudo nano /etc/apache2/sites-enabled/000-default.conf
 ```
 * Add these lines:
 ```
 DocumentRoot /var/www/html/twitch-live-events/public
<Directory /var/www/html/twitch-live-events/>
    Options Indexes FollowSymLinks
    AllowOverride all
    Require all granted
 </Directory>
 ```
 * Set up mod_rewrite
 ```
 $ sudo a2enmod rewrite
 ```
 * *Restart apache server*
 ```
 $ sudo service apache2 restart
 ```
 * Navigate to laravel project folder (twitch-live-events):
 ```
 $ sudo cd /twitch-live-events
 ```
 * Create .env file
 ```
 $ touch .env
 ```
 * Copy the content of .env.example into .env
 ```
 $ cp .env.example .env
 ```
 * Make the following changes to .env file:
    1. Change *APP_URL* to your domain
    2. Add databse configuration:
     ```
        - DB_HOST=host_name8
        - DB_DATABASE=database_name
        - DB_USERNAME=username
        - DB_PASSWORD=password
     ```
     3. Login to Pusher, go to [Pusher Dashboard](https://dashboard.pusher.com/) and create new app. Copy App Id, App Key, App Secret and App Cluster and paste into .env as follows: 
    ```
        - PUSHER_APP_ID=XXXXXX
        - PUSHER_APP_KEY=XXXXXXXXXXXX
        - PUSHER_APP_SECRET=XXXXXXXXXXXXXXX
        - PUSHER_APP_CLUSTER=XXX
    ```
     4. Login to [Twitch Developer](https://dev.twitch.tv/), go to [Twitch Console](https://dev.twitch.tv/console), register you application ( make sure to set OAuth Redirect URL as your-domain followed by **/logged** end point - for instance: ```http://localhost/logged``` ) and finally generate Client Secret. Copy Client Id and Client Secret and paste into .env as follows:
    ```
        - TWITCH_CLIENT_ID=XXXXXXXXXXXXXX
        - TWITCH_CLIENT_SECRET=XXXXXXXXXXXX
        - TWITCH_REDIRECT_URL=http://localhost (change it to your domain)
    ```
    
 * Install laravel packages:
 ```
 $ composer install
 ```
 * Give apache write access to the storage and bootstrap/cache folder
 * Give 777 permissions to public folder:
 ```
 $ sudo chmod -R 777 /public
 ```
 * Generate Application key:
 ```
 $ php artisan key:generate
 ```
 * Run migrations:
 ```
 $ php artisan migrate
 ```
 * Clear Caches:
 ```
 $ php artisan cache:clear
 $ php artisan view:clear
 $ php artisan route:cache
 $ php artisan config:cache
 
 ```
 
 Now you are good to go with this application. Open your browser and login to twitch live event app & Have Fun!

##### 2. Where do you see bottlenecks in your proposed architecture and how would you approach scaling this app starting from 100 reqs/day to 900MM reqs/day over 6 months?
##### Answer:
* MySQL database performance : The storage of users and their favorites in database will be impacted.this database is very strong but performace will be impacted with a larger number of users, corresponding favorites and subscritpions.
-Solution: Stored procedures can be used. NoSQL or other high performace databases can be considered.
* User's Favorite list: Pagination can be introduced.
* On the AWS side, it can be configured with a variable number of EC2 instances. The load balancer will handle the EC2 instances, it will init or put them to sleep as per need.
 ![image](https://raw.githubusercontent.com/gurvindrasingh/twitch-live-events/master/public/images/diagram.jpeg)
