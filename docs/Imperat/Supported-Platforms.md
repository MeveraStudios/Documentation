---
sidebar_position: 11
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Supported Platforms

Imperat is a versatile command dispatching framework designed to work across various platforms with the appropriate implementation.

## Repository Setup

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

## Core Dependency

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
        implementation 'dev.velix:imperat-core:{version}' // Replace {version}
    }
    ```
   </TabItem>
   <TabItem value="gradle-kts" label="Gradle (build.gradle.kts)">
    ```kotlin
    dependencies {
        implementation("dev.velix:imperat-core:{version}") // Replace {version}
    }
    ```
   </TabItem>
</Tabs>

---

## Platform Implementations

Choose the platform you are developing for to see specific setup instructions.

<Tabs groupId="platforms">
  {/* Bukkit Platform Tab */}
  <TabItem value="bukkit" label="Bukkit">
    <p>Implementation for Bukkit-based Minecraft servers (like Spigot, Paper).</p>
    <ul>
      <li>Main Class: <code>BukkitImperat</code></li>
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
    Call this **after** initializing Imperat but **before** registering any commands:
    ```java
    imperat.applyBrigadier();
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
      <li>Main Class: <code>BungeeImperat</code></li>
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
      <li>Main Class: <code>VelocityImperat</code></li>
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
      <li>Main Class: <code>MinestomImperat</code></li>
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
      <li>Main Class: <code>CommandLineImperat</code></li>
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
Ensure you use the **same `{version}`** for both `imperat-core` and the platform-specific module (e.g., `imperat-bukkit`) to avoid compatibility issues.
:::