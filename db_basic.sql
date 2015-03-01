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
-- Dumping data for table `ads`
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
  `email_preference` int(5) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `members`
--

LOCK TABLES `members` WRITE;
/*!40000 ALTER TABLE `members` DISABLE KEYS */;
INSERT INTO `members` VALUES (17,'Basic','Member','basic','basic@basic.com','e72880fb397eb904374d7df79214cfde96243f0bd8f2ecec0fd555f38b72805052ff795a04786449e718704f5f340ca20211b3136fa99c9a1ea14adcc430abfa','6c49a5ed4d26c52054734190bc4c436745678aa3053230731dedf5d3c7de4c8235b0430e2a53c2442129bb4b89efda257c8aab30f710a4b469143ed12bcc2093',1,0),(18,'Filmer','Member','filmer','filmer@filmer.com','8f6f73948aa27885383f3b850d2f5a775d362c80bf3e8d8c5c14b5aecb3d86ccf85421cf55a804a2a72b9a1071aeb34d70324c85ba52a38d6125d2d4004dfc64','feec589dd899b6baa7e005e5a43c42420df7f8bca0977d750e9987f05f277911cb2ff2bf3c122e26cf43360a27bd7b7b5e600f07b6ec9370a552f03df8fc80b2',0,0);
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

-- Dump completed on 2015-02-18 14:57:50
