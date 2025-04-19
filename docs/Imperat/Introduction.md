---
title: Imperat
slug: /Imperat
id: Introduction
sidebar_position: 1
---
import DocCardList from '@theme/DocCardList';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import LatestVersion from '../../src/components/LatestVersion';

# Introduction
Imperat is a powerful command dispatching framework, it allows you to create 
commands and converts them into the form of multiple data-condensed objects like `Command`,  `CommandUsage` and `CommandParameter`
These objects are registered/injected into the class `Imperat` which handles all information about each command and then dispatches/executes the command requested.

# Installation
Imperat is a versatile command dispatching framework designed to work across various platforms with the appropriate implementation.
This is will guide you through the installation step by step.

## Repository setup
Most builds won't require special repository configuration as Imperat artifacts are hosted on **Maven Central**. However, if you need to explicitly declare it:

<Tabs groupId="build-tool-repo">
  <TabItem value="maven" label="Maven (pom.xml)" default>
    ```xml
    <repositories>
      <repository>
        <id>maven-central</id>
        <url>https://repo1.maven.org/maven2/</url>
      </repository>
    </repositories>
    ```
  </TabItem>
  <TabItem value="gradle" label="Gradle (build.gradle)">
    ```gradle
    repositories {
      mavenCentral()
    }
    ```
   </TabItem>
   <TabItem value="gradle-kts" label="Gradle (build.gradle.kts)">
    ```kotlin
    repositories {
      mavenCentral()
    }
    ```
   </TabItem>
</Tabs>

## Core Dependency setup

Before adding any platform-specific module, you **must** include the core Imperat dependency:

<Tabs groupId="build-tool-core">
  <TabItem value="maven" label="Maven (pom.xml)" default>
    ```xml
    <dependency>
        <groupId>dev.velix</groupId>
        <artifactId>imperat-core</artifactId>
        <version>{version}</version> 
    </dependency>
    ```
  </TabItem>
  <TabItem value="gradle" label="Gradle (build.gradle)">
    ```groovy
    dependencies {
        implementation 'dev.velix:imperat-core:{version}' 
    }
    ```
   </TabItem>
   <TabItem value="gradle-kts" label="Gradle (build.gradle.kts)">
    ```kotlin
    dependencies {
        implementation("dev.velix:imperat-core:{version}")
    }
    ```
   </TabItem>
</Tabs>

## Platform Dependency setup

Choose the platform you are developing for to see specific setup instructions.

<Tabs groupId="platforms">
  {/* Bukkit Platform Tab */}
  <TabItem value="bukkit" label="Bukkit">
    <p>Implementation for Bukkit-based Minecraft servers (like Spigot, Paper).</p>
    <ul>
      <li>Imperat Class: <code>BukkitImperat</code></li>
      <li>Command Source: <code>BukkitSource</code></li>
    </ul>
    <h4>Installation</h4>
    <Tabs groupId="build-tool-bukkit">
      <TabItem value="maven" label="Maven (pom.xml)" default>
        ```xml
        <dependency>
            <groupId>dev.velix</groupId>
            <artifactId>imperat-bukkit</artifactId>
            <version>{version}</version> 
        </dependency>
        ```
      </TabItem>
      <TabItem value="gradle" label="Gradle (build.gradle)">
        ```groovy
        dependencies {
            implementation 'dev.velix:imperat-bukkit:{version}' // Use the same version as imperat-core
        }
        ```
      </TabItem>
      <TabItem value="gradle-kts" label="Gradle (build.gradle.kts)">
        ```kotlin
        dependencies {
            implementation("dev.velix:imperat-bukkit:{version}") // Use the same version as imperat-core
        }
        ```
      </TabItem>
    </Tabs>


    :::tip[Brigadier Integration]
    You can integrate Imperat with Mojang's Brigadier for enhanced command features (like suggestions and argument types) on compatible servers (Minecraft 1.13+).
    Call this `applyBrigadier` method while configuring imperat's instance, the method must be the **FIRST** one to be called in the builder's chain like the following example:
    ```java
    BukkitImperat imperat = BukkitImperat.builder(this)
        .applyBrigadier(true)
        .build();
    ```
    :::

    :::caution[Important]
    Do **NOT** register your commands within your plugin's <code>plugin.yml</code> file. Imperat handles registration dynamically.
    :::
  </TabItem>

  {/* BungeeCord Platform Tab */}
  <TabItem value="bungee" label="BungeeCord">
     <p>Implementation for BungeeCord Minecraft proxies.</p>
    <ul>
      <li>Imperat Class: <code>BungeeImperat</code></li>
      <li>Command Source: <code>BungeeSource</code></li>
    </ul>
    <h4>Installation</h4>
    <Tabs groupId="build-tool-bungee">
        <TabItem value="maven" label="Maven (pom.xml)" default>
            ```xml
            <dependency>
                <groupId>dev.velix</groupId>
                <artifactId>imperat-bungee</artifactId>
                <version>{version}</version> 
            </dependency>
            ```
        </TabItem>
        <TabItem value="gradle" label="Gradle (build.gradle)">
            ```gradle
            dependencies {
                implementation 'dev.velix:imperat-bungee:{version}' // Use the same version as imperat-core
            }
            ```
        </TabItem>
        <TabItem value="gradle-kts" label="Gradle (build.gradle.kts)">
            ```kotlin
            dependencies {
                implementation("dev.velix:imperat-bungee:{version}") // Use the same version as imperat-core
            }
            ```
        </TabItem>
    </Tabs>
  </TabItem>

  {/* Velocity Platform Tab */}
  <TabItem value="velocity" label="Velocity">
    <p>Implementation for Velocity Minecraft proxies.</p>
    <ul>
      <li>Imperat Class: <code>VelocityImperat</code></li>
      <li>Command Source: <code>VelocitySource</code></li>
    </ul>
    <h4>Installation</h4>
    <Tabs groupId="build-tool-velocity">
        <TabItem value="maven" label="Maven (pom.xml)" default>
            ```xml
            <dependency>
                <groupId>dev.velix</groupId>
                <artifactId>imperat-velocity</artifactId>
                <version>{version}</version>
            </dependency>    
            ```
        </TabItem>
        <TabItem value="gradle" label="Gradle (build.gradle)">
            ```gradle
            dependencies {
                implementation 'dev.velix:imperat-velocity:{version}' // Use the same version as imperat-core
            }
            ```
        </TabItem>
        <TabItem value="gradle-kts" label="Gradle (build.gradle.kts)">
            ```kotlin
            dependencies {
                implementation("dev.velix:imperat-velocity:{version}") // Use the same version as imperat-core
            }
            ```
        </TabItem>
    </Tabs>
  </TabItem>

  {/* Minestom Platform Tab */}
  <TabItem value="minestom" label="Minestom">
     <p>Implementation for Minestom Minecraft servers.</p>
    <ul>
      <li>Imperat Class: <code>MinestomImperat</code></li>
      <li>Command Source: <code>MinestomSource</code></li>
    </ul>
    <h4>Installation</h4>
    <Tabs groupId="build-tool-minestom">
        <TabItem value="maven" label="Maven (pom.xml)" default>
            ```xml
            <dependency>
                <groupId>dev.velix</groupId>
                <artifactId>imperat-minestom</artifactId>
                <version>{version}</version>
            </dependency>    
            ```
        </TabItem>
        <TabItem value="gradle" label="Gradle (build.gradle)">
            ```gradle
            dependencies {
                implementation 'dev.velix:imperat-minestom:{version}' // Use the same version as imperat-core
            }
            ```
        </TabItem>
        <TabItem value="gradle-kts" label="Gradle (build.gradle.kts)">
            ```kotlin
            dependencies {
                implementation("dev.velix:imperat-minestom:{version}") // Use the same version as imperat-core
            }
            ```
        </TabItem>  {/* CORRECTED closing tag */}
    </Tabs>
  </TabItem>

  {/* CLI Platform Tab */}
  <TabItem value="cli" label="CLI">
    <p>Implementation for standalone Command-Line Interface (CLI) applications.</p>
     <ul>
      <li>Imperat Class: <code>CommandLineImperat</code></li>
      <li>Command Source: <code>ConsoleSource</code></li>
    </ul>
    <p>This module provides a basic loop to read input from the console and dispatch commands.</p>
    <h4>Installation</h4>
    <Tabs groupId="build-tool-cli">
        <TabItem value="maven" label="Maven (pom.xml)" default>
            ```xml
            <dependency>
                <groupId>dev.velix</groupId>
                <artifactId>imperat-cli</artifactId>
                <version>{version}</version> 
            </dependency>
            ```
        </TabItem>
        <TabItem value="gradle" label="Gradle (build.gradle)">
            ```gradle
            dependencies {
                implementation 'dev.velix:imperat-cli:{version}' // Use the same version as imperat-core
            }
            ```
        </TabItem> {/* CORRECTED closing tag */}
        <TabItem value="gradle-kts" label="Gradle (build.gradle.kts)">
             ```kotlin
             dependencies {
                 implementation("dev.velix:imperat-cli:{version}") // Use the same version as imperat-core
             }
             ```
         </TabItem> {/* CORRECTED closing tag */}
    </Tabs>
  </TabItem>

  {/* Add other platforms similarly */}
  <TabItem value="other" label="Others">
    <p>Support for more platforms is planned for the future.</p>
    <p>Imperat's core is platform-agnostic, making it possible to implement support for various environments like Discord bots (JDA, Discord4J), other game servers, or custom applications.</p>
  </TabItem>
</Tabs>

:::tip[Note on Versions]
Ensure you use the **same version** (<LatestVersion owner="VelixDevelopments" repo="Imperat" codeBlock />) for both `imperat-core` and the platform-specific module (e.g., `imperat-bukkit`) to avoid compatibility issues.
:::

# Initiazling your Imperat

**Frequently asked question:** ***What's a command dispatcher/Imperat ??*** <br/>
**Answer:** It's the Ultimate class handling all data needed when processing and registering
commands objects (`Command`).
You have to create **new instance** of the imperat.
on the **start** of your platform by calling `YourPlatformImperat#builder` (the method is static) to configure your imperat instance,
then finally end the chain with `build` method to return a new instance of `YourPlatformImperat` type.

:::tip[TIP]
Creation of an instance of your `PlatformImperat` depends mainly on which platform
you are using.
:::


# Creation of Commands
There's mainly 2 ways of creating commands:
- [Annotations Command API](command-api/Annotations%20Command%20API.md) 
- [Classic (Built-in `Command.create(commandName)`)](command-api/Classic%20Command%20API.md)

I will be giving an intro to the easier way for creating commands which is the annotations.

## Annotated Commands
Creating commands with annotations is easy with 2 steps only:
1. Create a class that will represent your command class
2. Add unique annotations to it that allows the dispatcher to identify it as a command class

*Quick example (Same results as the one above, but with annotations):*
```java
@Command("example")  
public final class ExampleCommand {

  @Usage  
  public void defaultUsage(BukkitSource source) {  
   source.reply("This is just an example with no arguments entered");  
  }  

  @Usage  
  public void exampleOneArg(
	  BukkitSource source, 
	  @Named("firstArg") int firstArg
  ) { 
   source.reply("Entered required number= " + firstArg);  
  }
}
```

# Register your commands
Register your command by calling the method `imperat.registerCommand(command)` 
**Note:** the method is called from the `YourPlatformImperat` instance that you should have created

Here's a quick bukkit example:
```java
public class YourPlugin extends JavaPlugin {

  private BukkitImperat imperat;

  @Override
  public void onEnable() {
    //initializing imperat
    imperat = BukkitImperat.builder(plugin).build();

    //registering the command
    imperat.registerCommand(new ExampleCommand());
  }

}
```

# Customizing Imperat

If you wanted to register a [Context Resolver](Context%20Resolver.md) or a [Parameter Type](Parameter-Type.md) , or even 
set a [Suggestion Resolver](Suggestion%20Resolver.md) for tab-completion in commands, You would have to 
call some methods while configuring imperat.

With Imperat, you can even register your own sender/source type, check out [Source Resolver](Source%20Resolver.md)
For a complete detailed guide on this, please check out [Dispatcher API](Dispatcher%20API.md)

*Big-example:*
```java
BukkitImperat imperat = BukkitImperat.builder(plugin)
    .parameterType(Arena.class, new ArenaParameterType()) //registering custom type 'Arena'
    .parameterType(Kit.class, new KitParameterType()) //registering custom type 'Kit'
    .parameterType(DuelMode.class, new DuelModeParameterType()) //registering custom type 'DuelMode'
    .sourceResolver(CustomSource.class, CustomSource::new) //registering custom command sender/source type 'CustomSource'
  .build();
```

:::warning
If you ever wanted to create your own implementation of `Imperat` interface, 
you will not receive any support and your issue will be instantly ignored/discarded
:::

# Tutorials
Check out all the Imperat tutorials here!

<DocCardList />
