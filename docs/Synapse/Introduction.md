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

Just download the latest version of the plugin depending on the platform and put it in the plugins/mods folder of your platform
You can always find the latest version of the plugin on here https://github.com/MeveraStudios/Synapse/releases


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
