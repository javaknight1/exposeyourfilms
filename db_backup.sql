-- MySQL dump 10.13  Distrib 5.6.22, for osx10.8 (x86_64)
--
-- Host: localhost    Database: exposeyourfilms
-- ------------------------------------------------------
-- Server version	5.6.22

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `actor_associations`
--

DROP TABLE IF EXISTS `actor_associations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `actor_associations` (
  `associationId` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `filmId` int(10) unsigned NOT NULL,
  `actorId` int(10) unsigned NOT NULL,
  `role` varchar(100) NOT NULL,
  PRIMARY KEY (`associationId`),
  KEY `filmId` (`filmId`,`actorId`),
  KEY `filmId_2` (`filmId`),
  KEY `actorId` (`actorId`),
  CONSTRAINT `actor_associations_ibfk_1` FOREIGN KEY (`filmId`) REFERENCES `films` (`filmId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `actor_associations_ibfk_2` FOREIGN KEY (`actorId`) REFERENCES `actors` (`actorId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `actor_associations`
--

LOCK TABLES `actor_associations` WRITE;
/*!40000 ALTER TABLE `actor_associations` DISABLE KEYS */;
/*!40000 ALTER TABLE `actor_associations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `actors`
--

DROP TABLE IF EXISTS `actors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `actors` (
  `actorId` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `state` varchar(2) NOT NULL,
  PRIMARY KEY (`actorId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `actors`
--

LOCK TABLES `actors` WRITE;
/*!40000 ALTER TABLE `actors` DISABLE KEYS */;
/*!40000 ALTER TABLE `actors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ads`
--

DROP TABLE IF EXISTS `ads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ads` (
  `adId` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `filmmakerId` int(10) unsigned NOT NULL,
  `post_date` date NOT NULL,
  `expiration_date` date NOT NULL,
  `title` varchar(30) NOT NULL,
  `description` varchar(275) NOT NULL,
  PRIMARY KEY (`adId`),
  KEY `filmmakerId` (`filmmakerId`),
  KEY `filmmakerId_2` (`filmmakerId`),
  CONSTRAINT `ads_ibfk_1` FOREIGN KEY (`filmmakerId`) REFERENCES `films` (`filmId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dfilmsumping data for table `ads`
--

LOCK TABLES `ads` WRITE;
/*!40000 ALTER TABLE `ads` DISABLE KEYS */;
/*!40000 ALTER TABLE `ads` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `beta`
--

DROP TABLE IF EXISTS `beta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `beta` (
  `betaId` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(50) NOT NULL,
  `filmmaker` tinyint(1) NOT NULL,
  PRIMARY KEY (`betaId`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `beta`
--

LOCK TABLES `beta` WRITE;
/*!40000 ALTER TABLE `beta` DISABLE KEYS */;
/*!40000 ALTER TABLE `beta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `customers` (
  `customerId` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `first_name` varchar(25) NOT NULL,
  `last_name` varchar(25) NOT NULL,
  `street address` varchar(30) NOT NULL,
  `street address(2)` varchar(30) NOT NULL,
  `city` varchar(25) NOT NULL,
  `state` varchar(2) NOT NULL,
  `zip` int(5) unsigned NOT NULL,
  `birthday` date NOT NULL,
  `gender` tinyint(1) NOT NULL COMMENT 'true->male; false->female',
  `email` varchar(50) NOT NULL,
  `password` varchar(128) NOT NULL,
  `salt` varchar(128) NOT NULL,
  `filmmakerId` tinyint(1) NOT NULL,
  PRIMARY KEY (`customerId`),
  KEY `filmmakerId` (`filmmakerId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favorite`
--

DROP TABLE IF EXISTS `favorite`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `favorite` (
  `favoriteId` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `filmId` int(10) unsigned NOT NULL,
  `customerId` int(10) unsigned NOT NULL,
  `favorite_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`favoriteId`),
  KEY `filmId` (`filmId`,`customerId`),
  KEY `filmId_2` (`filmId`),
  KEY `customerId` (`customerId`),
  CONSTRAINT `favorite_ibfk_1` FOREIGN KEY (`filmId`) REFERENCES `films` (`filmId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `favorite_ibfk_2` FOREIGN KEY (`customerId`) REFERENCES `members` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorite`
--

LOCK TABLES `favorite` WRITE;
/*!40000 ALTER TABLE `favorite` DISABLE KEYS */;
/*!40000 ALTER TABLE `favorite` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedback`
--

DROP TABLE IF EXISTS `feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `feedback` (
  `feedbackId` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `customerId` int(10) unsigned DEFAULT NULL,
  `name` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `subject` varchar(50) NOT NULL,
  `description` varchar(500) NOT NULL,
  PRIMARY KEY (`feedbackId`),
  KEY `customerId` (`customerId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedback`
--

LOCK TABLES `feedback` WRITE;
/*!40000 ALTER TABLE `feedback` DISABLE KEYS */;
/*!40000 ALTER TABLE `feedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `films`
--

DROP TABLE IF EXISTS `films`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `films` (
  `filmId` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(50) NOT NULL,
  `filmmakerId` int(10) unsigned NOT NULL,
  `release_date` date NOT NULL,
  `post_date` date NOT NULL,
  `expiration_date` date NOT NULL,
  `rent_price` float DEFAULT NULL,
  `buy_price` float DEFAULT NULL,
  `rating` varchar(1) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`filmId`),
  KEY `filmmakerId` (`filmmakerId`),
  KEY `filmmakerId_2` (`filmmakerId`),
  KEY `filmId` (`filmId`),
  KEY `filmmakerId_3` (`filmmakerId`),
  KEY `title` (`title`),
  FULLTEXT KEY `title_2` (`title`),
  FULLTEXT KEY `title_3` (`title`,`description`),
  CONSTRAINT `films_ibfk_1` FOREIGN KEY (`filmmakerId`) REFERENCES `members` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=90 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `films`
--

LOCK TABLES `films` WRITE;
/*!40000 ALTER TABLE `films` DISABLE KEYS */;
INSERT INTO `films` VALUES (87,'zelda',9,'2014-10-29','2014-10-08','2015-00-08',1,2,'b','commercial'),(89,'planet earth',9,'2014-11-05','2014-10-10','2015-00-10',1,2,'b','planet earth intro');
/*!40000 ALTER TABLE `films` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `genres`
--

DROP TABLE IF EXISTS `genres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `genres` (
  `genreId` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`genreId`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `genres`
--

LOCK TABLES `genres` WRITE;
/*!40000 ALTER TABLE `genres` DISABLE KEYS */;
INSERT INTO `genres` VALUES (1,'Anime'),(2,'Action'),(3,'Suspense'),(4,'Adventure'),(5,'Drama'),(7,'Comedy'),(8,'Thriller'),(9,'Science Fiction'),(10,'Family'),(11,'Fantasy'),(12,'Horror'),(13,'Holiday'),(14,'Documentary'),(15,'Children'),(16,'Foreign'),(17,'Religious');
/*!40000 ALTER TABLE `genres` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `genres_in_films`
--

DROP TABLE IF EXISTS `genres_in_films`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `genres_in_films` (
  `genrefilmId` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `genreId` int(10) unsigned NOT NULL,
  `filmId` int(10) unsigned NOT NULL,
  `isMain` tinyint(1) NOT NULL COMMENT 'is genre or sub-genre?',
  PRIMARY KEY (`genrefilmId`),
  KEY `genreId` (`genreId`,`filmId`),
  KEY `genreId_2` (`genreId`),
  KEY `filmId` (`filmId`),
  CONSTRAINT `genres_in_films_ibfk_1` FOREIGN KEY (`genreId`) REFERENCES `genres` (`genreId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `genres_in_films_ibfk_2` FOREIGN KEY (`filmId`) REFERENCES `films` (`filmId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `genres_in_films`
--

LOCK TABLES `genres_in_films` WRITE;
/*!40000 ALTER TABLE `genres_in_films` DISABLE KEYS */;
/*!40000 ALTER TABLE `genres_in_films` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `login_attempts`
--

DROP TABLE IF EXISTS `login_attempts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `login_attempts` (
  `user_id` int(10) unsigned NOT NULL,
  `time` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `login_attempts`
--

LOCK TABLES `login_attempts` WRITE;
/*!40000 ALTER TABLE `login_attempts` DISABLE KEYS */;
INSERT INTO `login_attempts` VALUES (9,'1402502821'),(9,'1402502832'),(12,'1403280416'),(12,'1403280433'),(12,'1403280448'),(12,'1403280479'),(12,'1403280495'),(9,'1404749792'),(9,'1405343751'),(9,'1405343772'),(9,'1405952407'),(9,'1423602985'),(5,'1423603114'),(5,'1423603136'),(5,'1423603137'),(5,'1423603138'),(5,'1423603138'),(5,'1423603138'),(5,'1423603138'),(5,'1423603139'),(5,'1423603139'),(5,'1423603139'),(5,'1423603139'),(5,'1423603139'),(5,'1423603140'),(5,'1423603416'),(5,'1423603417'),(5,'1423603418'),(5,'1423603419'),(5,'1423603420'),(5,'1423603421'),(5,'1423603422'),(5,'1423603422'),(5,'1423603423'),(5,'1423603423'),(5,'1423603423'),(5,'1423603423'),(5,'1423603424'),(5,'1423603424'),(5,'1423603424'),(5,'1423603424'),(5,'1423603480'),(5,'1423603514'),(5,'1423603535'),(5,'1423603593'),(5,'1423603626'),(5,'1423603686'),(5,'1423682831'),(5,'1423682834'),(5,'1423682835'),(5,'1423682836'),(5,'1423682837'),(5,'1423682837');
/*!40000 ALTER TABLE `login_attempts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `members`
--

DROP TABLE IF EXISTS `members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `members` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `username` varchar(30) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` char(128) NOT NULL,
  `salt` char(128) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1 ->basic; 0->filmmaker',
  `email_preference` int(5) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `members`
--

LOCK TABLES `members` WRITE;
/*!40000 ALTER TABLE `members` DISABLE KEYS */;
INSERT INTO `members` VALUES (1,'Steve','Irwin','test_user','test@example.com','00807432eae173f652f2064bdca1b61b290b52d40e429a7d295d76a71084aa96c0233b82f1feac45529e0726559645acaed6f3ae58a286b9f075916ebf66cacc','f9aab579fc1b41ed0c44fe4ecdbfcdb4cb99b9023abb241a6db833288f4eea3c02f76e0d35204a8695077dcf81932aa59006423976224be0390395bae152d4ef',1,0),(2,'Betty','White','name','someone@email.com','1bb01c865337ed60d6b09ad26570c1feedfd2eb044a3697750455f61dddd3656cc0c8e25ea1c4bb561e479804a9d338ba65db8a169013998c31af3868b4bcc4d','eaa3435a976fec250c2f37b49c891e079897682b8f6839d54ef69fa0ab120ee10bd9abe173813414e3e8b6636e6e46121e93b70675811348326eae79fd393244',1,0),(3,'Steven','Spielberg','thisisme','person@place.com','02dd8405b08887d901f08f7c02b0b1028bda0df454c69ce2bc84a184852f96346652db1d4638e9f1d6a7e10dcfd1f1e5a5d444fb5d874c14bb7d1a16f02b8212','2144d13047ebf54c6f0a1a476e2055e89a7ce110a3d65b994163b6a2fe3c0d9d55c3a878990458ca96c030e346e177492041792405ae243e429d0514ca3c8ff7',1,0),(4,'Quinton','Tarantino','you','me@me.com','9f30d7ce3d5f25367974175d96e8cd87f5255a9718bbb33520283707cd0c577e4f6383b51e74da8e92c838eca20db53b300721b1235daa98800a271e1a7d5d1a','390fb5335c6cb4b0dd1cbc958f14fbea4d915a70fb6c7b48362304201bfdc3647cceffa0ad3f0e6a4807fbe72359c32dce3f1e4506cea1fba617c06cac2730c6',1,0),(5,'Tom','Cruise','asdf','asdf@email.com','823ea106815c14a0b4b2db04e7bb6cc0bb61813198f2d103395b7861db4de5b3ec3e3273c529e6adf63990f3b37978418b242a1fb79143d0ef1c20a844e20890','6639717db01f65ffa30867c158d8b94c172b66fbe8303c3ba477da6a7426eb43d28da4addc2e594b4ece5f3ec1d575da9fe3e3eb6068264f27bbee93225b2aa1',1,0),(6,'Bob','Jones','qwer','asdfff@email.com','3fd5f01803440ede0351425a7d2871b25b323d0a04f8a439b07ecca57396f35766ba08aba4eb1a2c9734156330f1331d6fd988a6064180bf49f25566ea6c5f98','513bcbbf7f90bf0d1e2c1919d4f8cf173cc708f81cf7a0745dac5b3bde563d00dbfaaa91d06dcecc88446598d2bb549ae02d990dad8a3dbbb1813fdbbe65e7cf',1,0),(7,'Cal ','Ripken','erty','hom@email.com','b91b43612a7bb1b83142c98c4186ee3f7ce8825b65ae2533344a958597ee051c704b510656a26d53541cf74d6c3770a2580f645ed041f329240311e0ea63e426','ad460d5d77c3a8a76e413815afe017d1611996aacbee635c69ff1523b2c2e528132ff8bc4096e4f2746e367bbffd9619fe4a0b7cea69f8eb7556f72778713720',1,0),(8,'Robert','Downey Jr.','ghj','ttt@email.com','0ebe6fa8e19e5c5fddc90b40cecfc8ffe275c7bd5e97f91fbb4dbd1ffebf4cddfabfa1de7e38267c9dbd099ed5a0c98e3b441b87f7b9f2ae85539941a587dde9','5920b3da369f28a94c116f9ccf744e116b188f955b87230159ef836dd1449434827f06eaa8e7ee2c539791c6897f2c3d5d1d701473cad63d749acaffe18319ef',1,0),(9,'Mario','Mario','mrfilmer','filmer@film.com','49dbca3b83bd4fa09922c97004119f3579c6ad24d71f699a9801025fe30ab79c56ab24b9d062cab55d64ab77a52cfaede88fe2f5830aa9b4ae6ed51eb65a9e7c','222731c392e9ca739afbbbcef6b3701ddcaddc5117717e3949c782d67f73a3845264e320410c3ca1528f1fb6a69e0bca00c11dfaeb193f12b71ebe1db65c0a65',0,0),(10,'Luigi','Mario','filmer','me@you.com','bbd42808d6a3dc02cb3b79f04a6da4a5474f121a55f818cb4d8c5fd82b74a40ea25f95c9d09395c7f41353ebfb27e5f52944419a72cdfc7bcdf6f64b38cdb52f','bdcc1665ee6dc2cf10331812e4aaceeb79ff26b5a85301ff2e0137d09ee5ebb29b801761703483bbcaf1a64e7fc95a0fdeb9a1742229a7485101e3c561dee3e7',1,0),(11,'Sam','Fisher','basic','basic@basic.com','f7e0f2274f520d400203428a282bf04016398f448ab42c8e187f6e445b64f2af07d3191cbeb09be8e40215dad5ff9d7142a3a71d1716bf5a586da15017abb050','3ee87dcda44f92a673567f284e3c5da41dd653697c9a8623634b1ccd7f44e18de4813e93807dd8d2d0328e65abb1f5d0950cc4648b104760e73399202db384e2',1,0),(12,'Rob','Avery','filmmaker','film@film.com','bd0209770e7010018227af0b12d63b758f2ac61c85384c94665a1ff7be7d70f45a3466b3eb32eac795984b4fc744c4b70c41bc2d0ee7cd98ebabbd0755971183','cfa5b78e4bccde5d21e788dabbac4de8bb9bda1ad4703c68dbdc7728b9d24719acae5854c3a3d2a09a7da8af7e14df41ed40af79283c3aa0cc9433dd43ed3481',0,0),(14,'Adam','Boteler','Aboteler','adamboteler@Yahoo.com','60c737f16c85617e0d07d4fd175f1b124505f771689470de37a9c3baa81705f0d3aa87befc11b3ce83322d65d7b5c8f5936c00c3841b327ca90953fbb4a5f21a','23ed0bf643c40677fcfa38dcf5a95fb43904a16b18f6499c3323c768538dd4f4950b5f2fc6039672c26e1df4499027e2e08474963e0d7b4ac7ceb036a200b8d0',1,0),(15,'Adam','Boteler','aboteler','adamboteler@yahoo.com','14681a744c2a2571e2156852f4fb7398925a1f4315df18ef765f65598a11dcebfff113847588b82e5a7c4852fd8dff9c0ebe9dc1565c493fbb36b7bcb972e7b6','e2c1eb1b1d2d2a80feebd183c95f3c544c3fd2ddffce433b9699bd3cd004dc58cf6a1726057fd1dbda7d2d58f6a882a86109a20a002f5b656ac9f10f83c03a62',1,0),(16,'Rob','Avery','tommy','rob@mail.com','a6f2f2a903436f0079db43d102c3a8cc27fe84f680a027cf1bab1b006171566fbc88edde18c8432cf4455cdbc00cca57ed3bdcb0a28d74d707e56f4d5ad5a29c','c88204e7e9b36f34cdb4780f86387afe283e2c148479897cb92eff8cfb1a93b2eac86261251bcba60ac9364a2dd487380733c0030c2aa43bcf138342626bd346',0,0);
/*!40000 ALTER TABLE `members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchase`
--

DROP TABLE IF EXISTS `purchase`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `purchase` (
  `purchaseId` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `filmId` int(10) unsigned NOT NULL,
  `customerId` int(10) unsigned NOT NULL,
  `purchase_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `amount` float NOT NULL,
  PRIMARY KEY (`purchaseId`),
  KEY `filmId` (`filmId`,`customerId`),
  KEY `customerId` (`customerId`),
  CONSTRAINT `purchase_ibfk_1` FOREIGN KEY (`filmId`) REFERENCES `films` (`filmId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `purchase_ibfk_2` FOREIGN KEY (`customerId`) REFERENCES `members` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase`
--

LOCK TABLES `purchase` WRITE;
/*!40000 ALTER TABLE `purchase` DISABLE KEYS */;
INSERT INTO `purchase` VALUES (8,87,9,'2014-11-08 07:06:46',2);
/*!40000 ALTER TABLE `purchase` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `queue`
--

DROP TABLE IF EXISTS `queue`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `queue` (
  `queueId` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `filmId` int(10) unsigned NOT NULL,
  `customerId` int(10) unsigned NOT NULL,
  `queue_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`queueId`),
  KEY `filmId` (`filmId`,`customerId`),
  KEY `customerId` (`customerId`),
  CONSTRAINT `queue_ibfk_1` FOREIGN KEY (`filmId`) REFERENCES `films` (`filmId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `queue_ibfk_2` FOREIGN KEY (`customerId`) REFERENCES `members` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `queue`
--

LOCK TABLES `queue` WRITE;
/*!40000 ALTER TABLE `queue` DISABLE KEYS */;
/*!40000 ALTER TABLE `queue` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ratings`
--

DROP TABLE IF EXISTS `ratings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ratings` (
  `ratingId` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `rating` float unsigned NOT NULL,
  `customerId` int(10) unsigned NOT NULL,
  `filmId` int(10) unsigned NOT NULL,
  PRIMARY KEY (`ratingId`),
  KEY `customerId` (`customerId`,`filmId`),
  KEY `customerId_2` (`customerId`),
  KEY `filmId` (`filmId`),
  CONSTRAINT `ratings_ibfk_1` FOREIGN KEY (`customerId`) REFERENCES `members` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ratings_ibfk_2` FOREIGN KEY (`filmId`) REFERENCES `films` (`filmId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ratings`
--

LOCK TABLES `ratings` WRITE;
/*!40000 ALTER TABLE `ratings` DISABLE KEYS */;
/*!40000 ALTER TABLE `ratings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rent`
--

DROP TABLE IF EXISTS `rent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rent` (
  `rentId` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `filmId` int(10) unsigned NOT NULL,
  `customerId` int(10) unsigned NOT NULL,
  `rent_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `amount` float NOT NULL,
  PRIMARY KEY (`rentId`),
  KEY `filmId` (`filmId`,`customerId`),
  KEY `filmId_2` (`filmId`),
  KEY `customerId` (`customerId`),
  KEY `customerId_2` (`customerId`),
  CONSTRAINT `rent_ibfk_1` FOREIGN KEY (`filmId`) REFERENCES `films` (`filmId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rent_ibfk_2` FOREIGN KEY (`customerId`) REFERENCES `members` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rent`
--

LOCK TABLES `rent` WRITE;
/*!40000 ALTER TABLE `rent` DISABLE KEYS */;
INSERT INTO `rent` VALUES (1,89,9,'2014-11-10 23:55:43',1);
/*!40000 ALTER TABLE `rent` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subgenre`
--

DROP TABLE IF EXISTS `subgenre`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `subgenre` (
  `subgenreId` int(10) unsigned NOT NULL,
  `name` varchar(30) NOT NULL,
  PRIMARY KEY (`subgenreId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subgenre`
--

LOCK TABLES `subgenre` WRITE;
/*!40000 ALTER TABLE `subgenre` DISABLE KEYS */;
/*!40000 ALTER TABLE `subgenre` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `uploads`
--

DROP TABLE IF EXISTS `uploads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `uploads` (
  `uploadId` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `filmId` int(10) unsigned NOT NULL,
  `name` varchar(10) NOT NULL,
  `type` int(11) NOT NULL COMMENT '0-> cover; 1->film_mp4; 2->film_ogv; 3->film_webm; 4->trailer_mp4; 5->trailer_ogv; 6->trailer_webm',
  `mime` varchar(5) NOT NULL,
  PRIMARY KEY (`uploadId`),
  KEY `filmId` (`filmId`),
  CONSTRAINT `uploads_ibfk_1` FOREIGN KEY (`filmId`) REFERENCES `films` (`filmId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=215 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `uploads`
--

LOCK TABLES `uploads` WRITE;
/*!40000 ALTER TABLE `uploads` DISABLE KEYS */;
INSERT INTO `uploads` VALUES (194,87,'VQqCCrqiKB',0,'jpg'),(195,87,'QLNgrEtXqK',1,'mp4'),(196,87,'tojKV2yCCU',2,'ogv'),(197,87,'BOq7glcuRp',3,'webm'),(198,87,'zNAniMihtF',4,'mp4'),(199,87,'BnPiD8aFZH',5,'ogv'),(200,87,'TEGo6YR3FT',6,'webm'),(208,89,'4Rph1zSrSz',0,'jpg'),(209,89,'c1aPjr2xj8',1,'mp4'),(210,89,'9iOvi0KWyt',2,'ogg'),(211,89,'r2nJ3h4Rfs',3,'webm'),(212,89,'nqH0jQBAxf',4,'mp4'),(213,89,'C9UuQ0Lysd',5,'ogg'),(214,89,'wxxB94E4PE',6,'webm');
/*!40000 ALTER TABLE `uploads` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `views`
--

DROP TABLE IF EXISTS `views`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `views` (
  `viewsId` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `customerId` int(10) unsigned NOT NULL,
  `filmId` int(10) unsigned NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `start_point` bigint(20) DEFAULT NULL COMMENT 'Seconds into movie.',
  `end_point` bigint(20) DEFAULT NULL COMMENT 'Seconds from start point in movie.',
  PRIMARY KEY (`viewsId`),
  KEY `customerId` (`customerId`,`filmId`),
  KEY `filmId` (`filmId`),
  KEY `customerId_2` (`customerId`),
  CONSTRAINT `views_ibfk_1` FOREIGN KEY (`customerId`) REFERENCES `members` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `views_ibfk_2` FOREIGN KEY (`filmId`) REFERENCES `films` (`filmId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `views`
--

LOCK TABLES `views` WRITE;
/*!40000 ALTER TABLE `views` DISABLE KEYS */;
INSERT INTO `views` VALUES (41,9,87,'2014-11-08 07:07:00',NULL,NULL),(42,9,87,'2014-11-08 07:09:09',NULL,NULL),(44,9,87,'2014-11-08 14:18:03',NULL,NULL),(45,9,87,'2014-11-08 14:32:55',NULL,NULL),(48,9,87,'2014-11-10 23:23:35',NULL,NULL),(49,9,89,'2014-11-10 23:58:51',NULL,NULL),(50,9,89,'2014-11-11 00:04:29',NULL,NULL),(51,9,89,'2014-11-11 00:04:36',NULL,NULL),(52,9,89,'2014-11-11 00:09:40',NULL,NULL),(53,9,89,'2014-11-11 00:10:08',NULL,NULL),(54,9,89,'2014-11-11 00:27:00',NULL,NULL),(55,9,89,'2014-11-11 01:09:02',NULL,NULL),(56,9,89,'2014-11-11 01:22:49',NULL,NULL),(57,9,89,'2015-01-17 03:15:21',NULL,NULL),(58,9,89,'2015-01-17 03:21:40',NULL,NULL),(59,9,89,'2015-01-17 03:21:58',NULL,NULL);
/*!40000 ALTER TABLE `views` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-02-16 20:56:53
