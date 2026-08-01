---
layout: default
canonical_url: 'https://jeetprksh.com/post/no-xml-spring-and-hibernate-integration/'
title: No XML Spring and Hibernate Integration
description: Creating an end to end Spring Hibernate application without using any XML configuration
tags: [hibernate, spring, java, database]
---

Back in the pre Spring 3.1 days, we had to configure each and every bean into one of the spring configuration files which only happens to be an XML. And so if we were building a web application with Spring which is also using a relational database to store all its data, we needed to create a bean tag into one of those spring configuration XML files for reading out database connection properties to create a data source bean, which we then feed as a parameter to yet another bean tag to create a database session factory bean.

In this post we will be building a small restful web application with Spring MVC integrated with Hibernate to fetch the user record from MySQL database server and display it as a JSON response on the browser, without writing a single XML file. Furthermore we will also be doing away with tomcat’s web.xml leveraging latest Servlet 3.1 APIs and doing all of that configuration in our Java classes. So what are we waiting for!

## Configuring Spring and Hibernate Integration

We can start by making a maven project with webapp archetype into any of our favourite IDE. And in its `pom.xml` file we can give all the dependencies as per [this gist](https://gist.github.com/jeetprksh/486bb92eac1b6c9f4043fa8666060c5e). Notice that as one of the properties we have to set `failOnMissingWebXml` to be false so that we can safely delete `web.xml` file.

Now we can start with configuring DispatcherServlet for our Spring MVC application which we can do in a single class:

```java
public class AppConfig extends AbstractAnnotationConfigDispatcherServletInitializer {

  @Override
  protected Class<?>[] getRootConfigClasses() {
    return new Class[] { HibernateConfig.class };
  }

  @Override
  protected Class<?>[] getServletConfigClasses() {
    return new Class[] { WebMvcConfig.class };
  }

  @Override
  protected String[] getServletMappings() {
    return new String[] { "/" };
  }

}
```

A couple of points to note here:

- This class is extending the `AbstractAnnotationConfigDispatcherServletInitializer` which automatically configure `DispatcherServlet` and the Spring application context.
- In `getServletMappings()` methods we return one or more paths that `DispatcherServlet` will be mapped to.
- In `getServletConfigClasses()` we would be returning the `@Configuration` annotated classes that are having beans from which `DispatcherServlet` will be loading its application context.
- Classes returned from `getRootConfigClasses()` will be used to configure other application contexts that are created by `ContextLoaderListener` and are shared among them.

This is all we need to configure our `DispatcherServlet`, now let's look into `HibernateConfig.java` and `WebMvcConfig.java`. In `HibernateConfig.java` we need to create all the beans that are necessary for handling interaction with database via Hibernate.

```java
@Configuration
@EnableTransactionManagement
public class HibernateConfig {

  @Bean
  public LocalSessionFactoryBean getSessionFactory() throws PropertyVetoException {
    LocalSessionFactoryBean bean = new LocalSessionFactoryBean();

    Properties hibernateProperties = new Properties();
    hibernateProperties.put("hibernate.dialect", "org.hibernate.dialect.MySQLDialect");
    hibernateProperties.put("hibernate.show_sql", "true");

    bean.setHibernateProperties(hibernateProperties);
    bean.setDataSource(getDataSource());
    bean.setPackagesToScan("com.spring5.app.dto");
    return bean;
  }

  @Bean
  public ComboPooledDataSource getDataSource() throws PropertyVetoException {
    ComboPooledDataSource dataSource = new ComboPooledDataSource();

    dataSource.setDriverClass("com.mysql.cj.jdbc.Driver");
    dataSource.setJdbcUrl("jdbc:mysql://localhost:3306/app-db?useSSL=false");
    dataSource.setUser("root");
    dataSource.setPassword("qwerty123");
    dataSource.setAcquireIncrement(10);
    dataSource.setIdleConnectionTestPeriod(0);
    dataSource.setInitialPoolSize(5);
    dataSource.setMaxIdleTime(0);
    dataSource.setMaxPoolSize(50);
    dataSource.setMaxStatements(100);
    dataSource.setMinPoolSize(5);

    return dataSource;
  }

  @Bean
  public JdbcTemplate getJdbcTemplate() throws PropertyVetoException {
    JdbcTemplate template = new JdbcTemplate();    	
    template.setDataSource(getDataSource());    	
    return template;
  }

  @Bean
  public HibernateTransactionManager getTransactionManager() throws PropertyVetoException {
    HibernateTransactionManager transactionManager = new HibernateTransactionManager();
    transactionManager.setSessionFactory(getSessionFactory().getObject());
    return transactionManager;
  }

}
```

In `WebMvcConfig.java` we need to create web specific beans, so as we are creating restful endpoints we would need appropriate message converters that would be required to convert Java objects to their proper JSON representations.

```java
@Configuration
@EnableWebMvc
@ComponentScan("com.spring5.app")
public class WebMvcConfig extends WebMvcConfigurationSupport {

  @Override
  public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
    converters.add(customJackson2HttpMessageConverter());
    super.addDefaultHttpMessageConverters(converters);
  }

  @Bean
  public MappingJackson2HttpMessageConverter customJackson2HttpMessageConverter() {
    MappingJackson2HttpMessageConverter jsonConverter = new MappingJackson2HttpMessageConverter();
    ObjectMapper objectMapper = new ObjectMapper();
    objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    jsonConverter.setObjectMapper(objectMapper);
    return jsonConverter;
  }

}
```

## Implementing REST and Persistence Layers

Now that we have configured all the important parts of our application we now need to implement a REST controller and corresponding Service and DAO that are quite straightforward.

```java
@RestController()
@RequestMapping("user")
public class UserController {

  @Autowired
  private UserService service;

  @RequestMapping(value = "{userId}", method = RequestMethod.GET)
  public @ResponseBody ServerResponse getUser(@PathVariable("userId") Long userId) {
    return this.service.getUser(userId);
  }
}
```
```java
@Repository
public class UserDaoImpl implements UserDao {
	
  @Autowired
  private SessionFactory sessionFactory;

  @Override
  public UserDTO getUser(Long userId) {
    TypedQuery<UserDTO> typedQuery = sessionFactory.getCurrentSession().createQuery("from UserDTO where id=" + userId.toString());
    return typedQuery.getSingleResult();
  }

}
```

And finally our service class is doing some mission critical stuff!

```java
@Service
public class UserServiceImpl implements UserService {

  @Autowired
  private UserDao userDao;

  @Override
  @Transactional(readOnly = true)
  public ServerResponse getUser(Long userId) {
    ServerResponse response = new ServerResponse();

    UserDTO dto = userDao.getUser(userId);
    response.setUser(new User(dto.getFirstName() + " " + dto.getLastName(), 
                        new Long(dto.getAge())));

    return response;
  }

}
```

## Database schema

Lastly for the application to work we also need to create database schema in our MySQL server:

```sql
create table if not exists `users` (
  `id`		int not null auto_increment,
  `firstName`	varchar(20),
  `lastName`	varchar(20),
  `age`		int,
  primary key (`id`)
);
insert into `users` values (1, "john", "doe", 29);
```

## Source Code

I have not put all of the code on this post, but you can check out the working project from [this github](https://github.com/jeetprksh/spring5-with-hibernate5) repository.