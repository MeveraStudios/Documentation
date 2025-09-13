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

## ⚡ Installation

The proccess is fairly simple:
1. Download the latest `synapse-PLATFORM-*.*.jar` from the [Releases](https://github.com/MeveraStudios/Synapse/releases).
2. Place the JAR file in your server's `plugins/` directory.
3. Restart your server.
4. Configure as needed.

## 🏗️ Structure
Synapse is a collection of ``Neuron``s

A ``Neuron`` is what a plugin registers to add Placeholders

Every ``Neuron`` has it's own ``Namespace``(s)

A namespace is what defines the name(s) of that ``Neuron``!
  
The format of placeholders is ``${namespace.placeholder:[args1]:[arg2]:etc..}``
These arguments can be surrounded by double quotes ("), signle quotes (') and back quotes (`)

So if a Neuron with the namespace ``player`` is registred, and we register a ``health`` placeholder inside of it, this will be the placeholder format:
``${player.health}``


## 🛠️ For Developers

Synapse is hosted on **maven-central**, so no need to add any specific repository.

<Tabs groupId="synapse-platforms">
  <TabItem value="bukkit" label="Bukkit/Paper">
  
  The Synapse class in this is case is: ``BukkitSynapse``

  And of course the Neuron class will be ``BukkitNeuron``
    <LatestVersionBlock 
      owner="MeveraStudios" 
      repo="Synapse" 
      group="studio.mevera" 
      id="synapse-bukkit" 
    />
  </TabItem>
  <TabItem value="bungee" label="BungeeCord">
  
  The Synapse class in this is case is: ``BungeeSynapse``

  And of course the Neuron class will be ``BungeeNeuron``
    <LatestVersionBlock 
      owner="MeveraStudios" 
      repo="Synapse" 
      group="studio.mevera" 
      id="synapse-bungee" 
    />
  </TabItem>
  <TabItem value="velocity" label="Velocity">
  
  The Synapse class in this is case is: ``VelocitySynapse``

  And of course the Neuron class will be ``VelocityNeuron``
    <LatestVersionBlock 
      owner="MeveraStudios" 
      repo="Synapse" 
      group="studio.mevera" 
      id="synapse-velocity" 
    />
  </TabItem>
</Tabs>
