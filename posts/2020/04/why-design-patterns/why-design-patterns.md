---
layout: default
canonical_url: 'https://jeetprksh.com/post/why-design-patterns/'
title: Why Design Patterns?
description: Why should we care about using design patterns in our projects?
tags: [design patterns, software, design, patterns]
---

![Kings Landing](https://awoiaf.westeros.org/thumb.php?f=King%27s_Landing.jpg&width=800 "You must be wondering what Kings Landing has to do with Design Patterns")

Somewhere in [Kings Landing](https://awoiaf.westeros.org/index.php/King%27s_Landing), [Tyrion](https://awoiaf.westeros.org/index.php/Tyrion_Lannister) and [Bronn](https://awoiaf.westeros.org/index.php/Bronn) were discussing their strategy for an upcoming Software Design tourney.

> **Tyrion:** Ser Bronn of Blackwater! I am sure you are all prepared for the upcoming tourney.<br>
> **Bronn:** Oh! I will be surprising all the knights with this new thing I am working on.<br>
> **Tyrion:** Just like you surprised Stannis at Blackwater? I would want to know more about that!<br>
> **Bronn:** So there are these special client object that wants to get some task done, you know like cleaning a castle or opening the gates. And then there are some command object that know how to execute those task on other set of objects, so for example, OpenGateCommand will do open gate operation on Gate object. And you know what? That client object would not care about how the gate is opened.<br>
> **Tyrion:** Excellent! I am sure you are going to topple a knight or two with this kind of design. It reminded me of old days when I was Acting Hand of The King.<br>
> **Bronn:** But I wish I could have a name for this software design. Who’s going to wait for me to explain all this?

It is evident from above conversation that there is nothing called Software Design Patterns in Westeros. What Bronn was trying to convey to Tyrion can be easily termed as Command Pattern in our world, but since neither of them know what Software Design Patterns are they will always be having a hard time explaining things related to software design to each other.

An excerpt from wikipedia on Design Patterns:

>"A software design pattern is a general, reusable solution to a commonly occurring problem within a given context in software design. It is not a finished design that can be transformed directly into source or machine code. It is a description or template for how to solve a problem that can be used in many different situations."

So why should we care about using Design Patterns in our projects?

## Shared Vocabulary

Design patterns adds on to a developer’s vocabulary so that he/she can easily communicate their ideas with fellow developers by saying more with less words. Other developers will know quickly what is being conveyed. For example, if both Tyrion and Bronn had a common understanding of Command Pattern, Bronn wouldn’t need to explain each and every aspect of what he is trying to do.

## Avoid Reinventing the Wheel

Design Patterns are proven techniques and solutions for commonly recurring problems that are developed from hard experience of other developers, providing us with ready-to-use design templates. And that really helps us to design and implement flexible and maintainable solutions without reinventing the wheel.

## Collection of Best Design Practices

The basic principles of object oriented programming namely Encapsulation, Abstraction, Polymorphism and Inheritance while these are perfect tools for designing software systems but doing so with the understanding of design patterns will further enhance them with additional design principles like "composition over inheritance", "encapsulate what varies" etc for creating flexible and future proof systems.

## Helps you to stay "In Design"

Design patterns helps developers keep the discussion at design level and avoid the minute details about classes, objects, functions and methods. We should only care about these details during implementation phase and not in design phase.

## Used by Frameworks and Libraries

It's not just that only we can leverage the power of design patterns to our advantage, but the famous frameworks and libraries are also using them to make our life simpler. For eg. JdbcTemplate and JmsTemplate in Spring framework are good examples of Template Pattern, also MapMaker in Guava library and StringBuilder in Java are perfect examples of Builder Pattern.

