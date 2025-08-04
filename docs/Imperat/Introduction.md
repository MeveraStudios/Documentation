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
import LatestVersionBlock from '../../src/components/LatestVersionBlock';

<p align="center"><img src="https://raw.githubusercontent.com/MeveraStudios/Imperat/refs/heads/master/logo.png" /></p><br/>
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

<LatestVersionBlock 
  owner="MeveraStudios" 
  repo="Imperat" 
  group="studio.mevera" 
  id="imperat-core" 
/>

## Preserve parameter names [OPTIONAL]

Imperat uses parameter names to generate helpful command metadata like usage examples and tab completion suggestions. However, Java doesn't preserve parameter names in the compiled bytecode by default. To enable this feature, you need to configure your build tool to preserve parameter names.

<Tabs groupId="build-tool-params">
  <TabItem value="maven" label="Maven (pom.xml)" default>
    ```xml
    <build>
      <plugins>
        <plugin>
          <groupId>org.apache.maven.plugins</groupId>
          <artifactId>maven-compiler-plugin</artifactId>
          <version>3.8.1</version>
          <configuration>
            <parameters>true</parameters>
          </configuration>
        </plugin>
      </plugins>
    </build>
    ```
  </TabItem>
  <TabItem value="gradle" label="Gradle (build.gradle)">
    ```groovy
    tasks.withType<JavaCompile> {
        // Preserve parameter names in the bytecode
        options.compilerArgs.add("-parameters")
    }
    
    // optional: if you're using Kotlin
    tasks.withType<KotlinJvmCompile> {
        compilerOptions {
            javaParameters = true
        }
    }
    ```
  </TabItem>
  <TabItem value="gradle-kts" label="Gradle (build.gradle.kts)">
    ```kotlin
    tasks.withType<JavaCompile> {
        // Preserve parameter names in the bytecode
        options.compilerArgs.add("-parameters")
    }
    
    // optional: if you're using Kotlin
    tasks.withType<KotlinJvmCompile> {
        compilerOptions {
            javaParameters = true
        }
    }
    ```
  </TabItem>
</Tabs>

:::tip[TIP] 
You wouldn't need to use `@Named` Explicitly on method parameters, if you preserved the names of the compiled paramters from your method signatures *(Explained how to do that above)*
:::

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
    <LatestVersionBlock 
      owner="MeveraStudios" 
      repo="Imperat" 
      group="studio.mevera" 
      id="imperat-bukkit" 
    />



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
      <li>Command Source: <code>BungeeSource</code></li>Z
    </ul>
    <h4>Installation</h4>
    <LatestVersionBlock 
      owner="MeveraStudios" 
      repo="Imperat" 
      group="studio.mevera" 
      id="imperat-bungee" 
    />
  </TabItem>

  {/* Velocity Platform Tab */}
  <TabItem value="velocity" label="Velocity">
    <p>Implementation for Velocity Minecraft proxies.</p>
    <ul>
      <li>Imperat Class: <code>VelocityImperat</code></li>
      <li>Command Source: <code>VelocitySource</code></li>
    </ul>
    <h4>Installation</h4>
    <LatestVersionBlock 
      owner="MeveraStudios" 
      repo="Imperat" 
      group="studio.mevera" 
      id="imperat-velocity" 
    />
  </TabItem>

  {/* Minestom Platform Tab */}
  <TabItem value="minestom" label="Minestom">
     <p>Implementation for Minestom Minecraft servers.</p>
    <ul>
      <li>Imperat Class: <code>MinestomImperat</code></li>
      <li>Command Source: <code>MinestomSource</code></li>
    </ul>
    <h4>Installation</h4>
    <LatestVersionBlock 
      owner="MeveraStudios" 
      repo="Imperat" 
      group="studio.mevera" 
      id="imperat-minestom" 
    />
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
    <LatestVersionBlock 
      owner="MeveraStudios" 
      repo="Imperat" 
      group="studio.mevera" 
      id="imperat-cli" 
    />
  </TabItem>

  {/* Add other platforms similarly */}
  <TabItem value="other" label="Others">
    <p>Support for more platforms is planned for the future.</p>
    <p>Imperat's core is platform-agnostic, making it possible to implement support for various environments like Discord bots (JDA, Discord4J), other game servers, or custom applications.</p>
  </TabItem>
</Tabs>

:::tip[Note on Versions]
Ensure you use the **same version** (<LatestVersion owner="MeveraStudios" repo="Imperat" codeBlock />) for both `imperat-core` and the platform-specific module (e.g., `imperat-bukkit`) to avoid compatibility issues.
:::

# Initializing Imperat

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
- [Annotations Command API](basics/Command%20Creation.md) 
- [Classic (Built-in `Command.create(imperat, commandName)`)](advanced/Classic%20Commands.md)  
  *(See the [Classic Commands](advanced/Classic%20Commands.md) page for a full guide and examples of this approach.)*

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

If you wanted to register a [Context Resolver](advanced/Context%20Resolver.md) or a [Parameter Type](basics/Parameter-Type.md) , or even 
set a [Suggestion Resolver](basics/Suggestion%20Resolver.md) for tab-completion in commands, You would have to 
call some methods while configuring imperat.

With Imperat, you can even register your own sender/source type, check out [Source Resolver](advanced/Source%20Resolver.md)
For a complete detailed guide on this, please check out [Customizing Imperat](advanced/Customizing%20Imperat.md)

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
