# Data Center System Deployment Manual

## Introduction

This document is a guide to install, configure and run the Data Center System of the BSN Spartan Network. This local system will help users manage their data centers and manage nodes and NTT. The system only interacts with installed full nodes of Non-Cryptocurrency Public Chains on Spartan Network, and never connects to any external third-party systems.

> As a clear demonstration, all commands in this document are run with root permission. These commands can also be run under normal user permissions, please set the file storage and configure the parameters properly.

## 1. Installation

### 1.1 Hardware Requirements
It is recommended to build the Data Center Management System on Linux Server with the following requirements:

#### Minimum Requirements:

- 2 CPU
- Memory: 4GB
- Disk: 25GB SSD
- Bandwidth: 20Mbps

#### Recommended Requirements:

- 4 CPU
- Memory: 16GB
- Disk: 50GB SSD
- Bandwidth: 20Mbps

### 1.2 Prerequisites

- Java 1.8 or later
- mysql 5.7 or later
- jar (Optional)
- Docker (Optional)

### 1.3 Creating the Database

1. Make sure you have installed MySQL 5.7 or later version in your system. You can go to [MySQL official website](https://dev.mysql.com/doc/mysql-linuxunix-excerpt/5.7/en/linux-installation.html) to learn how to install MySQL on Linux.
    ```
    mysql -V
    ```
    ![](https://github.com/BSN-Spartan/Data-Center-System/blob/main/images/1.mysqlversion.jpg?raw=true)

2. Get the mysql script from [here](https://github.com/BSN-Spartan/Data-Center-System/blob/main/src/main/resources/sql/v1.0/bsn_spartan_dc.sql)

3. Login to MySQL service, name and create the database:

   ```sql
   CREATE DATABASE db_name DEFAULT CHARACTER SET utf8 COLLATE = utf8_general_ci;
   ```
   ![](https://github.com/BSN-Spartan/Data-Center-System/blob/main/images/2.dbname.jpg?raw=true)
4. Execute sql script to initialize the table:
     ```sql
   use db_name;
   ```
   ![](https://github.com/BSN-Spartan/Data-Center-System/blob/main/images/3.usedb.jpg?raw=true)

5. Execute the rest commands in sequence. Then, check the table structure:
    ```
    show tables;
    ```
    The table of the database is like below:

    ![](https://github.com/BSN-Spartan/Data-Center-System/blob/main/images/4.showtables.jpg?raw=true)

## 2. Download and Configuration

### 2.1 Downloading the Package

Download the package of the Data Center System from [here](https://github.com/BSN-Spartan/Data-Center-System/releases/tag/v1.0.0). In the same link, you can also download the source code and compile it by yourself.

### 2.2 Downloading Configuration Files

Download the configuration files, including [application.yml](https://github.com/BSN-Spartan/Data-Center-System/blob/main/src/main/resources/application.yml), [application-prod.yml](https://github.com/BSN-Spartan/Data-Center-System/blob/main/src/main/resources/application-prod.yml) and [logback-spring.xml](https://github.com/BSN-Spartan/Data-Center-System/blob/main/src/main/resources/logback-spring.xml).

### 2.3 Configuration

#### 2.3.1 Editing `application.yml`

- Change the default login account information

  If the database has never been initialized with any account before, the service will be initialized with this information when started:

  ```yml
  system:
    adminName: xxx
    adminEmail: xxx@xxx.com
    defaultPassword: xxx
  ```
  Example:
  
  ![](https://github.com/BSN-Spartan/Data-Center-System/blob/main/images/6.%20application.jpg?raw=true)
#### 2.3.2 Editing `application-prod.yml`

- Configure the data source

  ```yml
  server:
    # Specify the port that runs the Data Center System
    port: 8085
  mysql:
    # Specify the IP address, port number and the name of your database
    write_url: jdbc:mysql://database-IP:port/db_name?useUnicode=true&characterEncoding=utf-8&zeroDateTimeBehavior=convertToNull&serverTimezone=UTC&allowMultiQueries=true&useSSL=false
    # Enter the login name of the database
    write_username: db_username
    # Enter the password
    write_password: db_password
    # Specify the IP address, port number and the name of your database
    read_url: jdbc:mysql://database-IP:port/db_name?useUnicode=true&characterEncoding=utf-8&zeroDateTimeBehavior=convertToNull&serverTimezone=UTC&allowMultiQueries=true&useSSL=false
    # Enter the login name of the database
    read_username: db_username
    # Enter the password
    read_password: db_password
  ```
  Example:
  
  ![](https://github.com/BSN-Spartan/Data-Center-System/blob/main/images/7.%20appprod.jpg?raw=true)
- Configure the node information

  ```yml
   chain:
    # Default Node's JSON-RPC interface of Spartan-I Chain
    nodeRpcAddress: "http://node-IP:node-rpc-port"
    # Default Chain's network ID, do not change this configuration
    chainId: 9090
    # Query the transaction pool's waiting time: millisecond, recommended 1.5 seconds
    txPoolSleep: 1500
    # Change the path of the Keystore file to a designated directory
    walletFilePath: "your-directory/wallet"
    # This number is recommended to be set as the latest block height of the Default Chain before the Data Center System started. The system can then parse events from all blocks after this block height. For example: blockHeight: 270441
    blockHeight: block_height
  ```
  Example:
  
  ![](https://github.com/BSN-Spartan/Data-Center-System/blob/main/images/8.%20prod2.jpg?raw=true)


## 3. Starting the Service

### 3.1 Starting by Package

Make sure Java 1.8 or later version has been installed in your system. You can go to [Oracle official website](https://docs.oracle.com/en/java/javase/13/install/installation-jdk-linux-platforms.html#GUID-737A84E4-2EFF-4D38-8E60-3E29D1B884B8) to learn how to install Java on Linux.
```
java -version
```

![](https://github.com/BSN-Spartan/Data-Center-System/blob/main/images/5.jpg?raw=true)

Put `Data-Center-System-0.0.1-SNAPSHOT.jar`, `application.yml`,  `application-prod.yml` and `logback-spring.xml` files into the same directory and run the command below:

```yml
java -jar Data-Center-System-0.0.1-SNAPSHOT.jar --spring.config.location=./application.yml --spring.config.location=./application-prod.yml --logging.config=./logback-spring.xml - LANG=zh_CN.UTF-8
```
Result:
![](https://github.com/BSN-Spartan/Data-Center-System/blob/main/images/9.rundatacenter.jpg?raw=true)

After starting up the Data Center System, you may find the "the basic information of data center is not configured" error message in the process. You need to configure the information after logging into the system.

You can also execute in background by `nohup`command:

```yml
nohup java -jar Data-Center-System-0.0.1-SNAPSHOT.jar --spring.config.location=./application.yml --spring.config.location=./application-prod.yml --logging.config=./logback-spring.xml - LANG=zh_CN.UTF-8 >/dev/null 2>&1 &
```

### 3.2 Starting by Docker

The container is `/bsn/spartan-dc` and the service working directory can be configured by the Data Center Operator:

```yml
version: "3"
services:
  spartan-dc:
    image: oracle-jdk11
    container_name: spartan-dc
    working_dir: /bsn/spartan-dc
    restart: always
    #privileged: true
    ports:
      - "8085:8085"
    volumes:
      - ./Data-Center-System-0.0.1-SNAPSHOT.jar:/bsn/spartan-dc/Data-Center-System-0.0.1-SNAPSHOT.jar
      - ./conf:/bsn/spartan-dc/conf
      - ./logs/:/bsn/spartan-dc/logs
      - ./wallet:/bsn/spartan-dc/src/main/resources/wallet
      - /etc/localtime:/etc/localtime
      #- /root/skywalking-agent/:/bsn/spartan-dc/skywalking-agent
    environment:
      # Specify the time zone
      - TZ=Asia/Shanghai
    entrypoint: java -jar Data-Center-System-0.0.1-SNAPSHOT.jar --spring.config.location=./conf/application.yml --spring.config.location=./conf/application-prod.yml --logging.config=./conf/logback-spring.xml - LANG=zh_CN.UTF-8
```
## 4. Data Center Registration

After successfully starting the service, the Data Center Operator can access to the system from `http://localhost:server_port`.

![](https://github.com/BSN-Spartan/Data-Center-System/blob/main/images/10.DChome.jpg?raw=true)

Before using the System, the Data Center Operator should go to the [Spartan Official Website](http://spartan.bsn.foundation/) to register a new data center.

Please refer to the [BSN Spartan Network User Manual](http://spartan.bsn.foundation/static/quick-start/2gettingStarted/2-1-4.html) for detailed instructions.