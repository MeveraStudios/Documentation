---
slug: /Synapse
id: Introduction
title: ''
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import DocCardList from '@theme/DocCardList';
import LatestVersionBlock from '../../src/components/LatestVersionBlock';

<img src="/assets/synapse-banner.png" alt="synapse-banner" />
 A powerful, modular placeholder translation system designed for dynamic text processing across multiple platforms.

### ⚡ Installation

The process is fairly simple:
1. Download the latest `synapse-PLATFORM-*.*.jar` from the [Releases](https://github.com/MeveraStudios/Synapse/releases).
2. Place the JAR file in your server's `plugins/` directory.
3. Restart your server.
4. Configure as needed.

### ✨ Features
#### Core Features
- 🚀 High Performance: Optimized placeholder resolution with intelligent caching
- 🔧 Modular Architecture: Clean separation between core logic and platform implementations
- 🎯 Type Safety: Strongly typed generics ensure compile-time safety
- ⚡ Async Processing: Non-blocking placeholder resolution with CompletableFuture support
- 🏗️ Extensible Design: Easy to add new platforms and custom neurons
- 📝 Rich API: Comprehensive API for both synchronous and asynchronous operations
- 🏷️ Namespace Management: Organized placeholder categorization and conflict prevention
- 🔄 Context-Aware Resolution: Placeholders resolved based on user context and environment

#### Advanced Features
- 🔗 Relational Placeholders: Placeholders that resolve values based on relationships between 2 Users
- 💾 Intelligent Caching: Built-in caching mechanisms with expiration support
- 🧪 Comprehensive Testing: Extensive test suite ensuring reliability
- 🔙 PAPI Backward-Compatibility: In Bukkit, you can simply call BukkitNeuron#hookToPAPI and we will do the rest

### 🏗️ Structure
Synapse is a collection of ``Neuron``s

A ``Neuron`` is what a plugin registers to add Placeholders

Every ``Neuron`` has it's own ``Namespace``(s)

A namespace is what defines the name(s) of that ``Neuron``!
  
The format of placeholders is ``${namespace.placeholder:[args1]:[arg2]:etc..}``
These arguments can be surrounded by double quotes ("), single quotes (') and back quotes (`)

So if a Neuron with the namespace ``player`` is registered, and we register a ``health`` placeholder inside of it, this will be the placeholder format:
``${player.health}``

### 🛠️ For Developers

Synapse is hosted on **maven-central**, so no need to add any specific repository.

<Tabs groupId="synapse-platforms">
  <TabItem 
    value="bukkit" 
    label={
      <>
        <img src="/assets/bukkit.png" alt="Bukkit Logo" style={{ height: 20, marginRight: 6, position: "relative", top: 2 }} />
        Bukkit
      </>
    }
  >
  • First of all, we add it to our ``plugin.yml``
    ```yaml
    name: "ExamplePlugin"
    version: 1.0.0
    main: com.example.Plugin
    softdepend:
    - Synapse
    ```
  • And then to our build tool!
    <LatestVersionBlock 
      owner="MeveraStudios" 
      repo="Synapse" 
      group="studio.mevera" 
      id="synapse-bukkit" 
    />
  • The Synapse class in this is case is: ``BukkitSynapse``

  • And of course the Neuron class will be ``BukkitNeuron``
  </TabItem>
  <TabItem 
    value="bungee" 
    label={
      <>
        <img src="/assets/bungeecord.png" alt="BungeeCord Logo" style={{ height: 20, marginRight: 6, position: "relative", top: 4 }} />
        BungeeCord
      </>
    }
  >
  • First of all, we add it to our ``plugin.yml``/``bungee.yml``
    ```yaml
    name: "ExamplePlugin"
    version: 1.0.0
    main: com.example.Plugin
    softdepend:
    - Synapse
    ```
  • And then to our build tool!
    <LatestVersionBlock 
      owner="MeveraStudios" 
      repo="Synapse" 
      group="studio.mevera" 
      id="synapse-bungee" 
    />
  • The Synapse class in this is case is: ``BungeeSynapse``

  • And of course the Neuron class will be ``BungeeNeuron``
  </TabItem>
  <TabItem 
    value="velocity" 
    label={
      <>
        <img src="/assets/velocity_logo.svg" alt="Velocity Logo" style={{ height: 20, marginRight: 6, position: "relative", top: 2 }} />
        Velocity
      </>
    }
  >

  • First of all, we add it to our ``@Plugin`` dependencies
  ```java
  @Plugin(
    id = "myfirstplugin",
    name = "My Plugin",
    version = "0.1.0",
    dependencies = {
      @Dependency(id = "synapse", optional = true)
    }
  )
  ```
  • And then to our build tool!
    <LatestVersionBlock 
      owner="MeveraStudios" 
      repo="Synapse" 
      group="studio.mevera" 
      id="synapse-velocity" 
    />
  • The Synapse class in this is case is: ``VelocitySynapse``
  
  • And of course the Neuron class will be ``VelocityNeuron``
  </TabItem>
</Tabs>
