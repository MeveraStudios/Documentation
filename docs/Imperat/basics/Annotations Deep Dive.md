---
sidebar_position: 3
---

# Annotations Deep Dive

Imperat provides a rich set of annotations that allow you to create powerful and flexible commands. This guide covers every annotation available in the framework, organized by their usage level.

:::warning
If any term isn't familiar to you in this section, please check out [Introduction](../Introduction.md) first.
:::

## Annotation Categories

Imperat annotations are classified into four categories based on where they can be used:

- **Class-level annotations** - Used only on classes
- **Method-level annotations** - Used only on methods  
- **Parameter-level annotations** - Used only on method parameters
- **Wildcard annotations** - Can be used on all levels

:::tip
An '**element**' here refers to a part of the command that is annotated - can be a class, a method, or even a parameter.
:::

## Class-Level Annotations

### @Command

Declares a root command with the following components:

- `String[] values` - Array of command names (first is primary, rest are aliases)
- `boolean ignoreAutoCompletionPermission` - Whether to check permissions for tab completion (default: false)

```java
@Command({"ban", "banplayer", "b"})
@Permission("admin.ban")
@Description("Ban players from the server")
public final class BanCommand {
    
    @Usage
    public void banPlayer(BukkitSource source, @Named("player") Player player) {
        // Implementation
    }
}
```

:::info Auto-Completion Permission
When `ignoreAutoCompletionPermission` is `false` (default), Imperat checks if the player has permission before showing tab completion. Set to `true` to always show completions regardless of permissions.
:::

:::note Bukkit Source Types
For Bukkit platform, you can use `Player` or `CommandSender` as source types in addition to `BukkitSource`. and using `Player` will force that usage to accept ONLY player as a source/sender.
:::

### @SubCommand

Declares a subcommand class or method with attachment configuration:
- `String value` - The subcommand name
- `AttachmentMode attachment` - How to attach to parent command (default: `BEFORE_PARAMETERS`)
- `boolean attachDirectly` - Whether to attach directly to root (default: `false`)

#### Class-Level Usage

```java
@Command("admin")
@Permission("admin.command")
public final class AdminCommand {
    
    @Usage
    public void defaultUsage(BukkitSource source) {
        source.reply("Admin commands: /admin ban <player>, /admin kick <player>");
    }
    
    @SubCommand("ban")
    @Permission("admin.ban")
    public static class BanSubCommand {
        
        @Usage
        public void banPlayer(BukkitSource source, @Named("player") Player player, @Optional @Named("reason") String reason) {
            String banReason = reason != null ? reason : "No reason provided";
            player.kickPlayer("You have been banned: " + banReason);
            source.reply("Banned " + player.getName() + " for: " + banReason);
        }
    }
    
    @SubCommand(value = "kick", attachment = AttachmentMode.AFTER_PARAMETERS)
    @Permission("admin.kick")
    public static class KickSubCommand {
        
        @Usage
        public void kickPlayer(BukkitSource source, @Named("player") Player player, @Optional @Named("reason") String reason) {
            String kickReason = reason != null ? reason : "No reason provided";
            player.kickPlayer("You have been kicked: " + kickReason);
            source.reply("Kicked " + player.getName() + " for: " + kickReason);
        }
    }
}
```

#### Method-Level Usage

```java
@Command("user")
public final class UserCommand {
    
    @Usage
    public void defaultUsage(BukkitSource source) {
        source.reply("User commands: /user profile <player>, /user info <player>");
    }
    
    @SubCommand("profile")
    public void showProfile(BukkitSource source, @Named("player") Player player) {
        source.reply("Profile of " + player.getName() + ":");
        source.reply("Health: " + player.getHealth() + "/" + player.getMaxHealth());
        source.reply("Level: " + player.getLevel());
        source.reply("Location: " + player.getLocation().getWorld().getName());
    }
    
    @SubCommand("info")
    public void showInfo(BukkitSource source, @Named("player") Player player) {
        source.reply("Info for " + player.getName() + ":");
        source.reply("UUID: " + player.getUniqueId());
        source.reply("Gamemode: " + player.getGameMode());
        source.reply("Online: " + player.isOnline());
    }
}
```

**Attachment Modes:**

To facilitate the learning process for you, we will be apply on the following command-class example: 
```java
    @Command("parent")
    public class MyCommand {

        @Usage //A default usage, since it doesnt have any required arguments
        public void def(PlatformSource source, @Default("0") Integer num) {
            // /parent [num]
            source.reply("num entered = " + num);    
        }

        @Usage //A main usage, since it STARTED with a required argument.
        public void main(PlatformSource source, String text) {
            source.reply("text entered = " + text);
        } 

        //empty usage is non-modifiable in commands,
        //it will always remain empty(no-args) by default.

    }
```  

- **`MAIN/UNSET`** (The default) - Subcommand is attached before the parent's required parameters
    Attaches `subcommand` **AFTER** the parent's required/main usage's parameters.
    So in the example above, if we add the following :
    ```java
        @SubCommand(value= "sub", attachmentMode= AttachmentMode.MAIN)
        public void subMain(PlatformSource source, String text, Double decimal) {
            //the usage would be like `/parent <text> sub <decimal>`
            //As you can see, the `sub` is AFTER the parent's main-usage's args.
            // which are `<text>` in this example.
        }
    ```
  
- **`DEFAULT`** - Subcommand is attached after the parent's default-usage's parameters.
    Attaches `subcommand` **AFTER** the parent's default usage's parameters.
    So in the example above, if we add the following :
    ```java
        @SubCommand(value= "sub", attachmentMode= AttachmentMode.DEFAULT)
        public void subDefault(PlatformSource source, @Default("0") Integer num, String text) {
            //the usage would be like `/parent [num] sub <text>`
            //As you can see, the `sub` is AFTER the parent's default-usage's args.
            //which are `[num]` in this example.
        }
    ```
  
- **`EMPTY`** - Subcommand is attached directly to parent's, ignoring parent parameters
    Attaches `subcommand` **DIRECTLY** to the parent, completely ignoring parent parameters.
    So in the example above, if we add the following :
    ```java
        @SubCommand(value= "sub", attachmentMode= AttachmentMode.EMPTY)
        public void subEmpty(PlatformSource source, String text) {
            //the usage would be like `/parent sub <text>`
            //As you can see, the `sub` ignores ALL parent parameters.
            //It's attached directly to the parent command.
        }
    ```

:::tip Attachment Mode Examples
- **MAIN/UNSET**: `/admin <player> ban` - `ban` comes after parent's main parameters
- **DEFAULT**: `/admin [page] history` - `history` comes after parent's default parameters  
- **EMPTY**: `/admin kick <player>` - kick ignores admin's parameters completely
:::

### @GlobalAttachmentMode

The `@GlobalAttachmentMode` annotation sets a fallback attachment mode for all subcommands that have their attachment mode set to `UNSET`. This allows you to define a default attachment behavior for your entire command class.

#### Usage

```java
@Command("admin")
@GlobalAttachmentMode(AttachmentMode.EMPTY)
@Permission("admin.command")
public final class AdminCommand {
    
    @Usage
    public void defaultUsage(BukkitSource source) {
        source.reply("Admin commands: /admin ban <player>, /admin kick <player>");
    }
    
    @SubCommand("ban") // Will use EMPTY attachment mode (from @GlobalAttachmentMode)
    @Permission("admin.ban")
    public void banPlayer(BukkitSource source, @Named("player") Player player) {
        // Usage: /admin ban <player> (ignores parent parameters)
        player.kickPlayer("You have been banned!");
        source.reply("Banned " + player.getName());
    }
    
    @SubCommand(value = "kick", attachment = AttachmentMode.MAIN) // Overrides global setting
    @Permission("admin.kick")
    public void kickPlayer(BukkitSource source, @Named("target") Player target, @Named("player") Player player) {
        // Usage: /admin <target> kick <player> (uses MAIN attachment mode)
        player.kickPlayer("You have been kicked!");
        source.reply("Kicked " + player.getName());
    }
}
```

#### When to Use

- **Consistent Behavior**: When most of your subcommands should have the same attachment mode
- **Reduced Boilerplate**: Avoid repeating the same attachment mode on every subcommand
- **Default Fallback**: Provides a sensible default for subcommands that don't specify an attachment mode

:::info Override Behavior
Individual subcommands can still override the global attachment mode by explicitly setting their own `attachment` parameter in the `@SubCommand` annotation.
:::

### @ExternalSubCommand

Declares that the current command class includes one or more external subcommand classes:

```java
// AdminSubCommand.java
@SubCommand("admin")
public final class AdminSubCommand {
    
    @Usage
    public void adminAction(BukkitSource source, @Named("action") String action) {
        source.reply("Admin action: " + action);
    }
    
    @Usage
    public void adminInfo(BukkitSource source) {
        source.reply("Admin panel");
    }
}

// UserSubCommand.java
@SubCommand("user")
public final class UserSubCommand {
    
    @Usage
    public void userAction(BukkitSource source, @Named("action") String action) {
        source.reply("User action: " + action);
    }
    
    @Usage
    public void userInfo(BukkitSource source) {
        source.reply("User panel");
    }
}

// MainCommand.java
@Command("main")
@ExternalSubCommand({AdminSubCommand.class, UserSubCommand.class})
public final class MainCommand {
    
    @Usage
    public void defaultUsage(BukkitSource source) {
        source.reply("Main command with multiple external subcommands");
    }
    
    @Usage
    public void mainAction(BukkitSource source, @Named("target") String target) {
        source.reply("Main action on: " + target);
    }
}
```

**Result:** This creates the following command structure:
- `/main` - Main command default usage
- `/main <target>` - Main command with target
- `/main admin <action>` - Admin subcommand with action
- `/main admin` - Admin subcommand default usage
- `/main user <action>` - User subcommand with action
- `/main user` - User subcommand default usage

### @ContextResolved

:::warning Context Resolver Knowledge Required
If you don't know what a Context Resolver is or how it works, please read the [Context Resolver](../advanced/Context%20Resolver.md) documentation first to understand the fundamentals before using this annotation.
:::

The `@ContextResolved` annotation is used on parameters to automatically inject context-resolved values that are not directly from user input but are created from the command context using custom logic.

This annotation allows you to obtain values that are deduced from the context (like the source, command data, etc.) without writing boilerplate code in each command method.

#### Usage

```java
@SubCommand("disband")
public void disband(BukkitSource source, @ContextResolved Guild guild) {
    guild.disband();
    source.reply("You have disbanded your guild successfully!");
}
```

#### Registration

Before using `@ContextResolved`, you must register a context resolver for the type:

```java
public final class GuildContextResolver implements ContextResolver<BukkitSource, Guild> {
    
    @Override
    public @NotNull Guild resolve(
            @NotNull Context<BukkitSource> context,
            @Nullable ParameterElement parameter
    ) throws ImperatException {
        var source = context.source();
        if (source.isConsole()) {
            throw new SourceException("Only a player can do this!");
        }
        Player player = source.as(Player.class);
        Guild guild = GuildRegistry.getInstance().getUserGuild(player.getUniqueId());
        if (guild == null) {
            throw new SourceException("You don't have a guild!");
        }
        return guild;
    }
}

// Register the resolver
imperat = BukkitImperat.builder(plugin)
    .contextResolver(Guild.class, new GuildContextResolver())
    .build();
```

#### Alternative Usage

You can also annotate the type itself to avoid repeating `@ContextResolved` on every parameter:

```java
@ContextResolved
public final class Guild {
    // Guild implementation
}

// Now you can use Guild directly without @ContextResolved annotation
@SubCommand("disband")
public void disband(BukkitSource source, Guild guild) {
    guild.disband();
    source.reply("You have disbanded your guild successfully!");
}
```

:::info Context Resolution
Context resolvers are useful for values that depend on the command source or other contextual information, such as user data, permissions, or game state that needs to be retrieved for each command execution.
:::

## Method-Level Annotations

### @Command

Declares a standalone command method (independent of root command):

```java
@Command("standalone")
@Permission("user.standalone")
public void standaloneCommand(BukkitSource source) {
    source.reply("This is a standalone command that doesn't need a class");
}
```



### @PreProcessor

Declares a pre-processor for the command that runs before command execution:

```java
@PreProcessor(ExamplePreProcessor.class)
public final class AdminCommand {
    // Command implementation
}

// Example PreProcessor Implementation:
public class ExamplePreProcessor implements CommandPreProcessor<BukkitSource> {
    @Override
    public void process(Imperat<BukkitSource> imperat, Context<BukkitSource> context, CommandUsage<BukkitSource> usage) throws ImperatException {
        if(context.source().isConsole()) {
            throw new SourceException(SourceException.ErrorLevel.SEVERE, "Only players are allowed to do this !");
        }
    }
}
```

:::warning[Empty Constructor Required]
**⚠️ Important:** All pre-processors and post-processors **MUST** have an empty public constructor. Imperat creates instances of these classes internally, so they cannot have parameters in their constructors.

**Example:**
```java
// ✅ Correct - Empty constructor
public class MyPreProcessor implements CommandPreProcessor<BukkitSource> {
    public MyPreProcessor() {} // Required!
    
    @Override
    public void process(Imperat<BukkitSource> imperat, Context<BukkitSource> context, CommandUsage<BukkitSource> usage) throws ImperatException {
        // Implementation
    }
}

// ❌ Wrong - Constructor with parameters
public class BadPreProcessor implements CommandPreProcessor<BukkitSource> {
    private String permission;
    
    public BadPreProcessor(String permission) { // This will cause errors!
        this.permission = permission;
    }
}
```
:::

### @PostProcessor

Declares a post-processor for the command that runs after command execution:

```java
@Command("admin")
@PostProcessor(LoggingPostProcessor.class)
public final class AdminCommand {
    // Command implementation
}

// Example PostProcessor Implementation:
public class LoggingPostProcessor implements CommandPostProcessor<BukkitSource> {
    @Override
    public void process(Imperat<BukkitSource> imperat, ResolvedContext<BukkitSource> context, CommandUsage<BukkitSource> usage) throws ImperatException {
        System.out.println("Command executed by: " + context.source().getName() + " at " + System.currentTimeMillis());
    }
}
```

:::warning[Empty Constructor Required]
**⚠️ Important:** All pre-processors and post-processors **MUST** have an empty public constructor. Imperat creates instances of these classes internally, so they cannot have parameters in their constructors.

**Example:**
```java
// ✅ Correct - Empty constructor
public class MyPostProcessor implements CommandPostProcessor<BukkitSource> {
    public MyPostProcessor() {} // Required!
    
    @Override
    public void process(Imperat<BukkitSource> imperat, ResolvedContext<BukkitSource> context, CommandUsage<BukkitSource> usage) throws ImperatException {
        // Implementation
    }
}

// ❌ Wrong - Constructor with parameters
public class BadPostProcessor implements CommandPostProcessor<BukkitSource> {
    private String config;
    
    public BadPostProcessor(String config) { // This will cause errors!
        this.config = config;
    }
}
```
:::

### @Cooldown

Declares a cooldown for the usage:

```java
@Cooldown(value= 5, unit= TimeUnit.SECONDS) // 5 seconds
public void expensiveCommand(BukkitSource source) {
    // This command can only be used once every 5 seconds
    source.reply("Expensive operation completed!");
}

@Cooldown(value= 1, unit= TimeUnit.MINUTES, permission= "tp.cooldown.bypass") // 1 minute
public void teleportCommand(BukkitSource source, @Named("target") Player target) {
    // Teleport with 1-minute cooldown, only way to bypass the cooldown:
    // is to have the bypass permission set above "tp.cooldown.bypass"
    source.as(Player.class).teleport(target);
    source.reply("Teleported to " + target.getName());
}

```


### @Async

Declares that the usage will be executed asynchronously:

```java
@Command("async")
@Async
public void asyncCommand(BukkitSource source) {
    // This will run on a separate thread
    try {
        Thread.sleep(2000); // Simulate long operation
        source.reply("Async operation completed!");
    } catch (InterruptedException e) {
        source.reply("Operation was interrupted");
    }
}

@Command("query")
@Async
public void databaseQuery(BukkitSource source, @Named("query") String query) {
    // Database operations should be async
    String result = DatabaseManager.executeQuery(query);
    source.reply("Query result: " + result);
}
```

## Parameter-Level Annotations

### @Named

Specifies a custom name for the parameter:

```java
@Command("target")
public void command(BukkitSource source, @Named("target") Player player) {
    // Parameter will be accessible as "target" in the context
    source.reply("Target player: " + player.getName());
}

@Command("teleport")
public void teleportCommand(BukkitSource source, @Named("destination") Location location) {
    // Parameter will be accessible as "destination"
    source.as(Player.class).teleport(location);
    source.reply("Teleported to destination");
}
```

:::info Parameter Names vs @Named
If you've configured your project to [preserve parameter names](../Introduction.md#preserve-parameter-names-optional), you don't need to use `@Named` for most cases. Imperat will automatically use the parameter names from your method signature.

**Example without @Named (when parameter names are preserved):**
```java
@Command("target")
public void command(BukkitSource source, Player player) {
    // Parameter will be accessible as "player" automatically
    source.reply("Target player: " + player.getName());
}
```

**When you still need @Named:**
- When parameter names are not preserved in your build
- When you want a different name than the parameter name
- For better code readability and explicit naming
:::

### @Optional

Makes the parameter optional:

```java
@Command("action")
public void command(BukkitSource source, @Optional @Named("reason") String reason) {
    // reason can be null if not provided
    String finalReason = reason != null ? reason : "No reason specified";
    source.reply("Action performed with reason: " + finalReason);
}

@Command("heal")
public void healCommand(BukkitSource source, @Optional @Named("target") Player target) {
    // target can be null, so we use the source player as default
    Player playerToHeal = target != null ? target : source.as(Player.class);
    playerToHeal.setHealth(playerToHeal.getMaxHealth());
    source.reply("Healed " + playerToHeal.getName());
}
```

### @Default

Provides a default value for optional parameters:

```java
@Command("action")
public void command(BukkitSource source, @Default("No reason provided") @Named("reason") String reason) {
    // reason will be "No reason provided" if not specified
    source.reply("Action performed with reason: " + reason);
}

@Command("broadcast")
public void broadcastCommand(BukkitSource source, @Default("Hello everyone!") @Named("message") String message) {
    // message will be "Hello everyone!" if not specified
    Bukkit.broadcastMessage(message);
}
```

:::tip Pro Tip
You can use `@Default` or `@DefaultProvider` without explicitly adding `@Optional`. If you want an optional argument with `null` as its default value, use `@Optional` only.
:::

### @DefaultProvider

Provides a dynamic default value through a supplier:

```java
@Command("color")
public void command(BukkitSource source, @DefaultProvider(RandomColorProvider.class) @Named("color") String color) {
    // color will be provided by RandomColorProvider (random color from predefined list)
    source.reply("Selected color: " + color);
}

@Command("broadcast")
public void broadcastCommand(BukkitSource source, @DefaultProvider(ServerTimeProvider.class) @Named("timestamp") String timestamp, @Named("message") @Greedy String message) {
    // timestamp will be provided by ServerTimeProvider (current server time)
    Bukkit.broadcastMessage("[" + timestamp + "] " + source.getName() + ": " + message);
}
```

:::danger[CRITICAL]
Make sure that any sub-class of `OptionalValueSupplier` has an empty public constructor.
:::

**Example DefaultProvider Implementation:**

```java
public class RandomColorProvider implements OptionalValueSupplier<String> {
    private static final String[] COLORS = {"red", "green", "blue", "yellow", "purple", "orange"};
    
    @Override
    public String get() {
        return COLORS[new Random().nextInt(COLORS.length)];
    }
}

public class PlayerNameProvider implements OptionalValueSupplier<String> {
    @Override
    public String get() {
        // Get the name of the player who executed the command
        return Bukkit.getPlayer(Bukkit.getOnlinePlayers().iterator().next().getUniqueId()).getName();
    }
}
```

### @Greedy

Makes the parameter consume all remaining arguments:

```java
@Command("message")
public void command(BukkitSource source, @Named("message") @Greedy String message) {
    // message will contain all remaining arguments
    source.reply("Full message: " + message);
}

@Command("broadcast")
public void broadcastCommand(BukkitSource source, @Named("message") @Greedy String message) {
    // message will contain everything after the command
    Bukkit.broadcastMessage(source.getName() + ": " + message);
}
```

:::danger[Important]
@Greedy parameters must be the LAST parameter in the method and only one @Greedy parameter is allowed per usage.
:::

### @Suggest

Provides static suggestions for tab completion:

```java
@Command("list")
public void command(BukkitSource source, @Suggest({"online", "offline", "all"}) @Named("type") String type) {
    // Tab completion will suggest: online, offline, all
    source.reply("Selected type: " + type);
}

@Command("gamemode")
public void gamemodeCommand(BukkitSource source, @Suggest({"survival", "creative", "adventure", "spectator"}) @Named("mode") String mode) {
    // Tab completion will suggest gamemodes
    GameMode gameMode = GameMode.valueOf(mode.toUpperCase());
    source.as(Player.class).setGameMode(gameMode);
    source.reply("Gamemode set to: " + mode);
}
```

### @Values

Restricts parameter values to a specific set of allowed values with optional case sensitivity:

```java
@Command("color")
public void command(BukkitSource source, @Values({"red", "green", "blue"}) @Named("color") String color) {
    // Only "red", "green", or "blue" are allowed (case-sensitive by default)
    source.reply("Selected color: " + color);
}

@Command("difficulty")
public void difficultyCommand(BukkitSource source, @Values(value = {"peaceful", "easy", "normal", "hard"}, caseSensitive = false) @Named("difficulty") String difficulty) {
    // Case-insensitive matching: "PEACEFUL", "Peaceful", "peaceful" all work
    source.reply("Difficulty set to: " + difficulty);
}

@Command("status")
public void statusCommand(BukkitSource source, @Values({"online", "offline", "away"}) @Named("status") String status) {
    // Only these exact values are allowed
    source.reply("Status updated to: " + status);
}
```

:::info @Values vs @Suggest
- **`@Values`**: Restricts input to specific allowed values (validation)
- **`@Suggest`**: Provides tab completion suggestions (no validation)

`@Values` will throw an exception if an invalid value is provided, while `@Suggest` only helps with tab completion.
:::

### @SuggestionProvider

Provides dynamic suggestions through a registered resolver:

```java
@Command("player")
public void command(BukkitSource source, @SuggestionProvider("players") @Named("player") Player player) {
    // Tab completion will use the "players" suggestion resolver
    source.reply("Selected player: " + player.getName());
}

@Command("world")
public void worldCommand(BukkitSource source, @SuggestionProvider("worlds") @Named("world") World world) {
    // Tab completion will suggest available worlds
    source.as(Player.class).teleport(world.getSpawnLocation());
    source.reply("Teleported to world: " + world.getName());
}
```

:::info Key Difference
- **`@Suggest`**: Static tab-completion results that don't change based on context
- **`@SuggestionProvider`**: Dynamic tab-completion results that can change based on context or command-sender

`@SuggestionProvider` takes a `String` which indicates the unique name of a `SuggestionResolver` registered in Imperat using `Imperat#registerNamedSuggestionResolver`.
:::

### @Range

Specifies a numeric range for validation:

```java
@Command("amount")
public void command(BukkitSource source, @Range(min = 1, max = 100) int amount) {
    // amount must be between 1 and 100
    source.reply("Amount set to: " + amount);
}

@Command("forward")
public void teleportCommand(BukkitSource source, @Range(min = 0, max = 1000)double distance) {
    // distance must be between 0 and 1000
    Location currentLoc = source.as(Player.class).getLocation();
    Location newLoc = currentLoc.add(currentLoc.getDirection().multiply(distance));
    source.as(Player.class).teleport(newLoc);
    source.reply("Teleported " + distance + " blocks forward");
}
```

If the number entered by the command source/sender is below the min or exceeds the max, a built-in `NumberOutOfRangeException` is thrown, stopping command execution and sending an error message to the command source.

### @Flag

Defines a flag parameter that requires a value:

```java
@Command("silent")
public void command(BukkitSource source, @Flag("silent") boolean silent) {
    // Usage: /command -silent true
    if (silent) {
        source.reply("Silent mode enabled");
    } else {
        source.reply("Silent mode disabled");
    }
}

@Command("broadcast")
public void broadcastCommand(BukkitSource source, @Flag("prefix") String prefix, @Greedy String message) {
    // Usage: /broadcast -prefix [Admin] Hello everyone
    String finalMessage = prefix != null ? prefix + " " + message : message;
    Bukkit.broadcastMessage(finalMessage);
}
```

### @Switch

Defines a switch parameter (boolean flag):

```java
@Command("silent")
public void command(BukkitSource source, @Switch({"silent", "s"}) boolean silent) {
    // Usage: /command -silent or /command -s
    if (silent) {
        source.reply("Silent mode enabled");
    } else {
        source.reply("Silent mode disabled");
    }
}

@Command("kick")
public void kickCommand(BukkitSource source, @Named("player") Player player, @Switch({"silent", "s"}) boolean silent, @Optional @Named("reason") String reason) {
    // Usage: /kick <player> [-silent] [reason]
    String kickReason = reason != null ? reason : "No reason provided";
    player.kickPlayer("You have been kicked: " + kickReason);
    
    if (!silent) {
        Bukkit.broadcastMessage(player.getName() + " has been kicked: " + kickReason);
    } else {
        source.reply("Silently kicked " + player.getName());
    }
}
```

:::info Flag vs Switch
- **`@Flag`**: A true flag comes with an input next to it (e.g., `-yourFlag <value-input>`)
- **`@Switch`**: A flag that gives a `boolean` value determined by its presence in the context (e.g., `-silent`)
:::

## Wildcard Annotations

### @Permission

Specifies permission requirements (can be used on classes, methods, and parameters):

```java
@Command("admin")
@Permission("admin.command")
public final class AdminCommand {
    
    @Usage
    @Permission("admin.kick")
    public void kickPlayer(BukkitSource source, @Permission("admin.kick.player") @Named("player") Player player) {
        // Requires admin.kick permission for method and admin.kick.player for parameter
    }
}
```

### @Description

Provides descriptions for help menus (can be used on classes, methods, and parameters):

```java
@Command("ban")
@Description("Main command for banning players")
public final class BanCommand {
    
    @Usage
    @Description("Ban a player from the server")
    public void banPlayer(BukkitSource source, @Description("Player to ban") @Named("player") Player player) {
        // Command implementation
    }
}
```

### @Help

The `@Help` annotation specifies a custom help provider for a command. This allows you to create custom help functionality that extends beyond the default help system, where you are able to specify a [HelpProvider](../advanced/Command%20Help.md) **per command**.

#### Usage

```java
@Command("admin")
@Help(CustomAdminHelpProvider.class)
@Permission("admin.command")
public final class AdminCommand {
    
    @Usage
    public void defaultUsage(BukkitSource source) {
        source.reply("Admin commands available");
    }
    
    @SubCommand("ban")
    public void banPlayer(BukkitSource source, @Named("player") Player player) {
        // Ban implementation
    }
}

// Custom help provider implementation
public final class CustomAdminHelpProvider implements HelpProvider<BukkitSource> {
    
    @Override
    public void provideHelp(Context<BukkitSource> context) {
        var source = context.source();
        source.reply("=== Admin Commands ===");
        source.reply("/admin ban <player> - Ban a player");
        source.reply("/admin kick <player> - Kick a player");
        source.reply("/admin mute <player> - Mute a player");
        source.reply("=====================");
    }
}
```

#### When to Use

- **Custom Help Format**: When you want a specific help format for certain commands
- **Conditional Help**: When help content should change based on user permissions or context
- **Rich Help Content**: When you need to include additional information beyond command descriptions
- **Platform-Specific Help**: When help should be formatted differently for different platforms

:::info Help Provider
The help provider class must implement `HelpProvider<S>` where `S` is your source type (e.g., `BukkitSource`). The `provideHelp` method receives the command context and can access the source, parameters, and other contextual information.

**Note**: The `@Help` annotation can only be used on classes and methods, not on parameters.
:::

## Comprehensive Example

Here's a complete example demonstrating many annotations working together:

```java
@Command("ban")  
@Permission("command.ban")  
@Description("Main command for banning players")  
public final class BanCommand {

    @Usage  
    public void showUsage(BukkitSource source) {
        source.reply("/ban <player> [-silent] [duration] [reason...]");  
    }

    @Usage  
    public void banPlayer(  
            BukkitSource source,  
            @Named("player") @SuggestionProvider("players") @Description("Player to ban") Player player,  
            @Switch({"silent", "s"}) @Description("Silent ban") boolean silent,  
            @Named("duration") @Optional @Values({"1h", "1d", "1w", "permanent"}) @Description("Ban duration") String duration,  
            @Named("reason") @Default("Breaking server laws") @Greedy @Description("Ban reason") String reason
    ) {
        String durationFormat = duration == null ? "FOREVER" : "for " + duration;  
        String msg = "Banning " + player.getName() + " " + durationFormat + " due to " + reason;  
        
        if (!silent)  
            Bukkit.broadcastMessage(msg);  
        else  
            source.reply(msg);  
    }  
}
```

This example demonstrates:
- **Class-level annotations**: `@Command`, `@Permission`, `@Description`
- **Method-level annotations**: `@Usage`, `@Switch`
- **Parameter-level annotations**: `@Named`, `@Optional`, `@Default`, `@Greedy`, `@Values`, `@SuggestionProvider`, `@Description`
- **Multiple usage types**: Empty usage and main usage with required arguments

## Advanced Features

### Custom Annotations

You can create your own annotations and define how they work using `AnnotationReplacer`. For detailed information, see [Custom Annotations](../advanced/Custom%20Annotations.md).

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface AdminCommand { }

// Register the replacer
imperat = BukkitImperat.builder(plugin)
    .annotationReplacer(
        AdminCommand.class, 
        (annotation) -> {
            var cmd = AnnotationFactory.create(Command.class, "value", "admin");
            var permission = AnnotationFactory.create(Permission.class, "value", "admin.command");
            var desc = AnnotationFactory.create(Description.class, "value", "Admin command");
            return List.of(cmd, permission, desc);
        }
    )
    .build();
```

### AnnotationFactory

Create annotations dynamically using the `AnnotationFactory`:

```java
var permission = AnnotationFactory.create(Permission.class, "value", "my.permission");
var description = AnnotationFactory.create(Description.class, "value", "My description");
```

## Best Practices

1. **Use meaningful names** for @Named parameters
2. **Always include source parameter** as the first parameter in usage methods
3. **Use @Optional sparingly** - prefer @Default when possible
4. **Keep @Greedy parameters last** and limit to one per usage
5. **Provide descriptions** for better help menus
6. **Use appropriate permissions** for security
7. **Consider performance** when using @Async

## Complete Example

Here's a comprehensive example using multiple annotations:

```java
@Command("ban")
@Permission("admin.ban")
@Description("Ban management system")
public final class BanCommand {

    @Usage
    @Description("Show ban command usage")
    public void showUsage(BukkitSource source) {
        source.reply("/ban <player> [-silent] [duration] [reason...]");
    }

    @Usage
    @Permission("admin.ban.player")
    @Description("Ban a player from the server")
    public void banPlayer(
        BukkitSource source,
        @Named("player") @SuggestionProvider("players") @Description("Player to ban") Player player,
        @Switch({"silent", "s"}) @Description("Silent ban") boolean silent,
        @Named("duration") @Optional @Suggest({"1h", "1d", "1w", "permanent"}) @Description("Ban duration") String duration,
        @Named("reason") @Default("No reason provided") @Greedy @Description("Ban reason") String reason
    ) {
        // Ban logic implementation
        String durationText = duration == null ? "permanent" : duration;
        String message = "Banning " + player.getName() + " for " + durationText + " - " + reason;
        
        if (!silent) {
            Bukkit.broadcastMessage(message);
        } else {
            source.reply(message);
        }
    }
}
```

This example demonstrates most of the annotations available in Imperat, showing how they work together to create a powerful and user-friendly command system. 