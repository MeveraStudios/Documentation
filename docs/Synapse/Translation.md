---
slug: /Synapse/Translation
id: Translation
title: 'Translation'
sidebar_position: 2
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

#### 1. Obtain Synapse Instance

<Tabs groupId="synapse-platforms">
  <TabItem value="bukkit" label="Bukkit/Paper">
    For Bukkit:
        ```java
        BukkitSynapse synapse = BukkitSynapse.get();
        ```
  </TabItem>
  <TabItem value="bungee" label="BungeeCord">
    For Bungee:
        ```java
        BungeeSynapse synapse = BungeeSynapse.get();
        ```
  </TabItem>
  <TabItem value="velocity" label="Velocity">
    For Velocity:
        ```java
        VelocitySynapse synapse = VelocitySynapse.get();
        ```
  </TabItem>
</Tabs>


#### 2. Normal String Translation
