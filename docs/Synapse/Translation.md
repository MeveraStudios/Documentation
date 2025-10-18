---
slug: /Synapse/Translation
id: Translation
title: 'Translation'
sidebar_position: 2
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

---
## 📝 Placeholder Syntax

Synapse uses a flexible placeholder format:
```
${namespace.placeholder}
${namespace.placeholder:arg1}
${namespace.placeholder:arg1:arg2}
${namespace.placeholder:"quoted arg":arg2}
```

**Examples:**
- `${player.name}` - Simple placeholder
- `${player.stats:DEATHS}` - With argument
- `${server.world_info:players}` - Named argument
- `${custom.message:"Hello World"}` - Quoted argument

**Argument Quoting:**
Arguments can be surrounded by:
- Double quotes: `"argument"`
- Single quotes: `'argument'`
- Back quotes: `` `argument` ``
---
## 🪨 Basic Translation
### Obtaining Synapse Instance

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

### Normal String Translation

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

### Relational Translation (Two Users)

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

### Error Handling

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

## 🎨 Adventure MiniMessage Integration

Synapse provides seamless integration with Adventure's MiniMessage for rich text formatting. All platform implementations automatically support MiniMessage tag resolution.

### Using Synapse with MiniMessage

<Tabs groupId="synapse-platforms">
  <TabItem value="bukkit" label="Bukkit/Paper">

```java
// Get the MiniMessage instance with Synapse placeholders
MiniMessage miniMessage = MiniMessage.builder()
    .tags(TagResolver.resolver(
        TagResolver.standard(),
        BukkitSynapse.get().asTagResolver()
    ))
    .build();

// Parse text with both placeholders and MiniMessage formatting
Component component = miniMessage.deserialize(
    "<gold>Hello <player_name>! You have <green><player_balance></green> coins!",
    Audience.audience(player)
);

// Send to player
player.sendMessage(component);
```

  </TabItem>
  <TabItem value="bungee" label="BungeeCord">

```java
// Get the MiniMessage instance with Synapse placeholders  
MiniMessage miniMessage = MiniMessage.builder()
    .tags(TagResolver.resolver(
        TagResolver.standard(),
        BungeeSynapse.get().asTagResolver()
    ))
    .build();

// Parse and send
Component component = miniMessage.deserialize(
    "<yellow>Welcome to <server_name>! Online: <blue><server_online></blue>",
    Audience.audience(player)
);

player.sendMessage(component);
```

  </TabItem>
  <TabItem value="velocity" label="Velocity">

```java
// Get the MiniMessage instance with Synapse placeholders
MiniMessage miniMessage = MiniMessage.builder()
    .tags(TagResolver.resolver(
        TagResolver.standard(), 
        VelocitySynapse.get().asTagResolver()
    ))
    .build();

// Parse and send
Component component = miniMessage.deserialize(
    "<gradient:blue:purple>Hello <player_name>!</gradient> Server: <server_name>",
    Audience.audience(player)
);

player.sendMessage(component);
```

  </TabItem>
</Tabs>

### Tag Format Differences

When using Synapse with MiniMessage, placeholders use **underscore notation** instead of dot notation:

- **Traditional Synapse**: `${player.name}` 
- **MiniMessage Tags**: `<player_name>`

The namespace and placeholder name are joined with underscores, and empty namespaces work as expected:

```java
// Neuron with namespace "player"
register("balance", context -> getBalance(context.user()));
// Usage: <player_balance>

// Neuron with empty namespace ""  
register("server_name", () -> getServerName());
// Usage: <server_name>
```

### Advanced MiniMessage Features

**Placeholders with Arguments:**
```java
// Register placeholder that accepts arguments
register("top_player", context -> {
    String[] args = context.arguments();
    int position = args.length > 0 ? Integer.parseInt(args[0]) : 1;
    return getTopPlayer(position);
});

// Usage in MiniMessage
Component msg = miniMessage.deserialize(
    "Top player: <yellow><top_player:1></yellow>",
    Audience.audience(player)
);
```

**Combining with Other Tag Resolvers:**
```java
MiniMessage miniMessage = MiniMessage.builder()
    .tags(TagResolver.resolver(
        TagResolver.standard(),
        BukkitSynapse.get().asTagResolver(),
        Placeholder.parsed("custom", "Custom Value"),
        // Other custom resolvers...
    ))
    .build();
```

This integration allows you to leverage the full power of MiniMessage's formatting capabilities while seamlessly incorporating dynamic placeholder values from Synapse!

---
## 💡 Best Practices

### Performance
- Use `translateAsync()` for expensive operations (database queries, API calls)
- Cache frequently-used translations if possible
- Avoid translating in tight loops

### Error Handling
- Always handle `CompletableFuture` exceptions in async operations
- Check for null/empty strings before translating
- Invalid placeholders return unchanged - validate your placeholder names

### User Experience
- Provide fallback messages for failed translations
- Consider using placeholder defaults for optional data
- Test placeholders with different user contexts (players, console, etc.)