---
layout: default
canonical_url: 'https://jeetprksh.com/post/getting-started-with-hibernate/'
title: Getting Started With Hibernate
description: Setting up a simple Hibernate project without using any web framework
tags: [hibernate, java, database]
---

Hibernate is one of the most famous Object-Relational Mapping (ORM) tool that allows a developer to easily map specialised Java objects, known as Entities, to database tables while also enabling him/her to create new rows on database tables and/or update the existing ones via those Java objects. This capability greatly reduces the development time as now we don’t have to take care of each and every intricate detail about how the data is being created, updated and deleted on the database. And it need not saying that an awesome framework like Hibernate provides a lot more than just that.

In this post we will be setting up a simple Java project to get started with Hibernate. But we will not be using a Web MVC framework like Spring on top of Hibernate because using any other framework will be a distraction for understanding Hibernate itself. So we will be creating a standalone Hibernate application and use JUnit for unit testing each Hibernate feature we learn. As our first example we will be inserting a record on User table in a local MySQL server. So lets get started!

## Create a Maven Project

Start by creating a maven project on your favourite IDE and edit the pom.xml file to have the following Hibernate, JUnit and MySQL (since we are using a MySQL database) dependencies. The final pom.xml file would look like this:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.jeetprksh</groupId>
  <artifactId>hibernate-examples</artifactId>
  <version>1.0-SNAPSHOT</version>
  <name>hibernate-examples</name>

  <dependencies>
    <dependency>
      <groupId>junit</groupId>
      <artifactId>junit</artifactId>
      <version>4.11</version>
      <scope>test</scope>
    </dependency>

    <dependency>
      <groupId>mysql</groupId>
      <artifactId>mysql-connector-java</artifactId>
      <version>8.0.11</version>
    </dependency>

    <dependency>
      <groupId>org.hibernate</groupId>
      <artifactId>hibernate-core</artifactId>
      <version>5.2.10.Final</version>
    </dependency>
  </dependencies>

</project>
```

## Configuring Hibernate

Any Hibernate application would want minimal configuration that tells it what database to use and where to look for it. We configure all of that information in `hibernate.cfg.xml` file:

```xml
<?xml version='1.0' encoding='utf-8'?>
<!DOCTYPE hibernate-configuration PUBLIC
        "-//Hibernate/Hibernate Configuration DTD//EN"
        "http://hibernate.sourceforge.net/hibernate-configuration-5.0.dtd">

<hibernate-configuration>
    <session-factory>
        <property name="hibernate.connection.driver_class">com.mysql.jdbc.Driver</property>
        <property name="hibernate.connection.url">jdbc:mysql://localhost:3306/testDB</property>
        <property name="hibernate.connection.username">root</property>
        <property name="hibernate.connection.password">qwerty123</property>
        <property name="hibernate.connection.pool_size">10</property>
        <property name="show_sql">true</property>
        <property name="dialect">org.hibernate.dialect.MySQLDialect</property>
        <property name="hibernate.current_session_context_class">thread</property>

        <mapping class="com.jeetprksh.hibernate.entity.User" />
    </session-factory>
</hibernate-configuration>
```

Apart from having database connection details it is also having details for mapped Entities. We need to keep this file in maven’s resource directory so that we have it on classpath. Now in our Java application we will read out this configuration to create an instance of SessionFactory which will be used to create and manage Session which in turn provides a CRUD interface for mapped Entities. The overall Java configuration class would be:

```java
public class HibernateConfig {

  private static final SessionFactory sessionFactory;

  private static ServiceRegistry serviceRegistry;

  static {
    try {
      StandardServiceRegistry standardRegistry =
              new StandardServiceRegistryBuilder().configure("hibernate.cfg.xml").build();
      Metadata metaData = new MetadataSources(standardRegistry).getMetadataBuilder().build();
      sessionFactory = metaData.getSessionFactoryBuilder().build();
    } catch (Exception e) {
      e.printStackTrace();
      throw new ExceptionInInitializerError(e);
    }
  }

  public static SessionFactory getSessionFactory() {
    return sessionFactory;
  }
}
```

## Entity Class

The entity class is a special Java class which represents a database table in our Java application and any CRUD operation that we need to on that database table would be done through this entity class. Since we need to insert a record into user table we will be creating a User entity class that would look like this:

```java
@Entity
public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private int id;

  private String firstName;

  private String lastName;

  private int age;

  public User(String firstName, String lastName, int age) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.age = age;
  }

  // getters and setters
  
}
```

Notice that our User class is using following Hibernate annotations:

- A class level annotation `@Entity` which makes it an Entity mapped with the table having similar name. If name of entity class and that of table needs to differ then we can specify table name in optional annotation parameter as `@Entity(name = "user_table")`.
- With `@Id` annotation on id attribute we are making it the unique identifier for User entity.
- `@GeneratedValue` decides how the unique identifier would be generated while inserting new records into User table.

## Creating the DAO Layer

Data Access Object would be the single point of contact for whole application for updating and querying records to and from database. In our case the unit test cases will be using these DAOs for same. Since we need to insert a user entity the corresponding `UserDao` will look like this:

```java
public class UserDaoImpl extends CommonDaoImpl implements UserDAO {

  @Override
  public int createUser(User user) throws HibernateException {
    return super.saveEntity(user);
  }

}
```

Notice that `UserDao` will only be having data access methods specific to User entity, so if we are having another entity, say `Address`, it will require its own DAO class, `AddressDao`. But these DAOs are dependent on more generic `CommonDao` which would be communicating directly with Hibernate for saving, querying and updating entities.

```java
public class CommonDaoImpl {

  private SessionFactory sessionFactory;
  private Session session;

  public CommonDaoImpl() {
    this.sessionFactory = HibernateConfig.getSessionFactory();
    this.session = sessionFactory.getCurrentSession();
  }

  protected int saveEntity(Object obj) throws HibernateException {
    Transaction transaction = session.beginTransaction();
    int id = (Integer) session.save(obj);
    transaction.commit();
    return id;
  }
}
```

Each method in this DAO would be responsible for starting a transaction on an instance of `Session` object, save the Entity on same `Session` instance and then commit the transaction.

## Putting It All Together

Finally, we have configured and implemented all the necessary things and now it is time we put in the final piece to see it all in action, the unit test.

```java
public class Tests {

  private static final Logger logger = Logger.getLogger(Tests.class.getName());

  private UserDAO userDao;

  public Tests() {
    this.userDao = new UserDaoImpl();
  }

  @Test
  public void testInsertUser() {
    User user = new User("Robb", "Stark", 17);
    Integer id = (Integer) userDao.createUser(user);
    assertTrue(id instanceof Integer);
  }
}
```

Notice that for unit testing the insert User our unit test case is first making the User object and giving it to the DAO layer to get it inserted into database. The DAO layer will return the unique identifier of the record just inserted which we will use as the pass/fail criteria for this unit test.

## Code

Working code has been committed on [this](https://github.com/jeetprksh/hibernate-examples) github repository.