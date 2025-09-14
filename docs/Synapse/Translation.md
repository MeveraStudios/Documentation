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

<Tabs groupId="synapse-platforms">
  <TabItem value="bukkit" label="Bukkit/Paper">
    ```java
    // Using a User object
    BukkitUser user = synapse.asUser(player);
    String result = synapse.translate("Hello ${player.name}!", user);
    
    // Using origin object directly (CommandSender)
    String result = synapse.translate("Hello ${player.name}!", player);
    
    // With multiple placeholders
    String message = synapse.translate("${player.name} has ${player.health} health in ${player.world}", player);
    ```
  </TabItem>
  <TabItem value="bungee" label="BungeeCord">
    ```java
    // Using a User object
    BungeeUser user = synapse.asUser(proxiedPlayer);
    String result = synapse.translate("Hello ${player.name}!", user);
    
    // Using origin object directly
    String result = synapse.translate("Hello ${player.name}!", proxiedPlayer);
    ```
  </TabItem>
  <TabItem value="velocity" label="Velocity">
    ```java
    // Using a User object
    VelocityUser user = synapse.asUser(player);
    String result = synapse.translate("Hello ${player.name}!", user);
    
    // Using origin object directly
    String result = synapse.translate("Hello ${player.name}!", player);
    ```
  </TabItem>
</Tabs>

#### 3. Relational Translation (Two Users)

When you need placeholders that depend on relationships between two users:

<Tabs groupId="synapse-platforms">
  <TabItem value="bukkit" label="Bukkit/Paper">
    ```java
    // Compare two players
    String comparison = synapse.translate("${compare.distance} blocks apart", player1, player2);
    
    // Using origin objects directly
    String result = synapse.translate("${compare.isSame}", commandSender1, commandSender2);
    
    // Using User objects
    BukkitUser user1 = synapse.asUser(player1);
    BukkitUser user2 = synapse.asUser(player2);
    String result = synapse.translate("${compare.level}", user1, user2);
    ```
  </TabItem>
  <TabItem value="bungee" label="BungeeCord">
    ```java
    // Compare two proxied players
    String comparison = synapse.translate("${compare.server}", player1, player2);
    
    // Using User objects
    BungeeUser user1 = synapse.asUser(player1);
    BungeeUser user2 = synapse.asUser(player2);
    String result = synapse.translate("${compare.ping}", user1, user2);
    ```
  </TabItem>
  <TabItem value="velocity" label="Velocity">
    ```java
    // Compare two velocity players
    String comparison = synapse.translate("${compare.server}", player1, player2);
    
    // Using User objects
    VelocityUser user1 = synapse.asUser(player1);
    VelocityUser user2 = synapse.asUser(player2);
    String result = synapse.translate("${compare.connected}", user1, user2);
    ```
  </TabItem>
</Tabs>

#### 4. Asynchronous Translation

For non-blocking placeholder resolution:

<Tabs groupId="synapse-platforms">
  <TabItem value="bukkit" label="Bukkit/Paper">
    ```java
    // Simple async translation
    synapse.translateAsync("Loading ${database.players} players...", player)
        .thenAccept(result -> player.sendMessage(result))
        .exceptionally(throwable -> {
            player.sendMessage("Failed to load: " + throwable.getMessage());
            return null;
        });
    
    // With custom executor
    Executor customExecutor = Executors.newFixedThreadPool(4);
    synapse.translateAsync("${expensive.calculation}", player, customExecutor)
        .thenAccept(player::sendMessage);
    
    // Async relational translation
    synapse.translateAsync("${compare.stats}", player1, player2)
        .thenAccept(result -> {
            player1.sendMessage(result);
            player2.sendMessage(result);
        });
    ```
  </TabItem>
  <TabItem value="bungee" label="BungeeCord">
    ```java
    // Simple async translation
    synapse.translateAsync("Server status: ${server.status}", player)
        .thenAccept(result -> player.sendMessage(new TextComponent(result)));
    
    // With custom executor
    synapse.translateAsync("${network.players}", player, customExecutor)
        .thenAccept(result -> player.sendMessage(new TextComponent(result)));
    ```
  </TabItem>
  <TabItem value="velocity" label="Velocity">
    ```java
    // Simple async translation
    synapse.translateAsync("Network info: ${network.players}", player)
        .thenAccept(result -> player.sendMessage(Component.text(result)));
    
    // With custom executor
    synapse.translateAsync("${server.tps}", player, customExecutor)
        .thenAccept(result -> player.sendMessage(Component.text(result)));
    ```
  </TabItem>
</Tabs>

#### 5. Error Handling

```java
// Handle null or empty text
String result = synapse.translate(null, player); // Returns null
String result = synapse.translate("", player);   // Returns ""

// Handle invalid placeholders (unregistered namespaces)
String result = synapse.translate("${invalid.placeholder}", player); 
// Returns: "${invalid.placeholder}" (unchanged)

// Handle exceptions in async operations
synapse.translateAsync("${might.fail}", player)
    .handle((result, throwable) -> {
        if (throwable != null) {
            return "Error: " + throwable.getMessage();
        }
        return result;
    })
    .thenAccept(player::sendMessage);
```
