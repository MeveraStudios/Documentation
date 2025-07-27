---
sidebar_position: 4
---

# Sub-Commands

Subcommands are a powerful feature in Imperat that allows you to create hierarchical command structures. They enable you to organize related functionality under a single root command, making your commands more intuitive and easier to manage.

:::info
Subcommands are treated as commands themselves, so they have the same usage types (EMPTY, DEFAULT, MAIN) as regular commands.
:::

## Three Ways to Create Subcommands

Imperat provides three flexible approaches to create subcommands, each with its own advantages and use cases.

### Way 1: Methods with @SubCommand

Create subcommands directly as methods within your command class.

```java
@Command("user")
public final class UserCommand {
    
    @Usage
    public void defaultUsage(BukkitSource source) {
        source.reply("User command");
    }
    
    @SubCommand("profile")
    public void showProfile(BukkitSource source, @Named("player") Player player) {
        source.reply("Showing profile for " + player.getName());
    }
    
    @SubCommand("settings")
    public void showSettings(BukkitSource source) {
        source.reply("User settings");
    }
}
```

**Result:** This creates the following command structure:
- `/user` - Main command
- `/user profile <player>` - Profile subcommand
- `/user settings` - Settings subcommand

:::tip Simple and Direct
This approach is the simplest and most straightforward way to create subcommands. It's perfect for commands with a few related subcommands that don't require complex organization.
:::

### Way 2: Inner Classes with @SubCommand

Create subcommands as inner classes within your main command class.

#### Static Inner Classes

```java
@Command("admin")
public final class AdminCommand {
    
    @Usage
    public void defaultUsage(BukkitSource source) {
        source.reply("Admin command");
    }
    
    @SubCommand("ban")
    public static class BanSubCommand {
        
        @Usage
        public void defaultUsage(BukkitSource source) {
            source.reply("Ban subcommand");
        }
        
        @Usage
        public void banPlayer(
            BukkitSource source,
            @Named("player") Player player,
            @Optional String reason
        ) {
            source.reply("Banning " + player.getName() + " for: " + reason);
        }
    }
    
    @SubCommand("kick")
    public static class KickSubCommand {
        
        @Usage
        public void kickPlayer(
            BukkitSource source,
            @Named("player") Player player
        ) {
            source.reply("Kicking " + player.getName());
        }
    }
}
```

#### Non-Static Inner Classes

```java
@Command("game")
public final class GameCommand {
    
    private final GameManager gameManager;
    
    public GameCommand(GameManager gameManager) {
        this.gameManager = gameManager;
    }
    
    @SubCommand("start")
    public class StartSubCommand {
        
        @Usage
        public void startGame(BukkitSource source) {
            gameManager.startGame(); // Can access outer class fields
            source.reply("Game started!");
        }
    }
}
```

:::tip Organized and Modular
Inner classes provide better organization for complex subcommands while keeping related functionality together. Static inner classes are preferred for most use cases.
:::

### Way 3: External Classes with @ExternalSubCommand

Create subcommands as separate classes and include them in your main command using the `@ExternalSubCommand` annotation.

#### External Subcommand Classes

```java
// FirstSub.java
@SubCommand("first")
public final class FirstSub {
    
    @Usage
    public void defaultUsage(BukkitSource source) {
        source.reply("First subcommand executed!");
    }
    
    @Usage
    public void withArg(BukkitSource source, @Named("message") String message) {
        source.reply("First subcommand with message: " + message);
    }
}

// SecondSub.java  
@SubCommand("second")
public final class SecondSub {
    
    @Usage
    public void defaultUsage(BukkitSource source) {
        source.reply("Second subcommand executed!");
    }
}
```

#### Main Command with Inheritance

```java
@Command("test")
@ExternalSubCommand({FirstSub.class, SecondSub.class})
public final class TestCommand {
    
    @Usage
    public void defaultUsage(BukkitSource source) {
        source.reply("Main test command");
    }
}
```

**Result:** This creates the following command structure:
- `/test` - Main command
- `/test first` - First subcommand
- `/test first <message>` - First subcommand with argument
- `/test second` - Second subcommand

#### Recursive Inheritance

:::warning For Beginners
Recursive inheritance is an advanced feature. If you're new to Imperat or command frameworks, you may want to master basic subcommands and inheritance first before using this feature.
:::

Recursive inheritance lets you build deep, multi-level command hierarchies by having subcommand classes inherit from other subcommand classes. This means you can create commands like `/menu settings audio` by chaining subcommands together.

**Simple Real-Life Example: Menu System**
```java
// Level 1: Root command class
@Command("menu")
@ExternalSubCommand(SettingsSubCommand.class)
public final class MenuCommand {
    @Usage
    public void defaultUsage(BukkitSource source) {
        source.reply("Main menu. Use /menu settings to configure settings.");
    }
}

// Level 2: Settings subcommand class
@SubCommand("settings")
@ExternalSubCommand(AudioSettingsSubCommand.class)
public final class SettingsSubCommand {
    @Usage
    public void defaultUsage(BukkitSource source) {
        source.reply("Settings menu. Use /menu settings audio to configure audio settings.");
    }
}

// Level 3: Audio settings subcommand class
@SubCommand("audio")
public final class AudioSettingsSubCommand {
    @Usage
    public void defaultUsage(BukkitSource source) {
        source.reply("Audio settings menu.");
    }
}
```
**Result:**
- `/menu` → Main menu
- `/menu settings` → Settings menu
- `/menu settings audio` → Audio settings menu

This approach is useful for building nested menus, categories, or any feature that benefits from a tree-like structure.

**How it works:**
- Each subcommand class can include another subcommand class using `@ExternalSubCommand`.
- This creates a chain, so each level adds a new subcommand to the path.
- You can go as deep as you need (but keep user experience in mind).

#### Complex Inheritance Chains

:::warning For Beginners
Complex inheritance chains are an advanced topic. If you're just starting out, focus on simple subcommands and single-level inheritance first.
:::

You can combine multiple levels of inheritance to create powerful, reusable command structures. This is useful for large plugins or applications with many related commands.

**Example: Admin/User Command Hierarchy**
```java
// Root command inherits admin and user command groups
@Command("main")
@ExternalSubCommand({AdminCommands.class, UserCommands.class})
public final class MainCommand {
    @Usage
    public void defaultUsage(BukkitSource source) {
        source.reply("Main command");
    }
}

// Admin group inherits ban and kick commands
@SubCommand("admin")
@ExternalSubCommand({BanCommands.class, KickCommands.class})
public final class AdminCommands {
    // Admin-related subcommands
}

// User group inherits profile and settings commands
@SubCommand("user")
@ExternalSubCommand({ProfileCommands.class, SettingsCommands.class})
public final class UserCommands {
    // User-related subcommands
}

// Each leaf class defines its own usages
@SubCommand("ban")
public final class BanCommands {
    @Usage
    public void ban(BukkitSource source, @Named("player") Player player) {
        source.reply("Banned " + player.getName());
    }
}

@SubCommand("kick")
public final class KickCommands {
    @Usage
    public void kick(BukkitSource source, @Named("player") Player player) {
        source.reply("Kicked " + player.getName());
    }
}

@SubCommand("profile")
public final class ProfileCommands {
    @Usage
    public void showProfile(BukkitSource source, @Named("player") Player player) {
        source.reply("Profile for " + player.getName());
    }
}

@SubCommand("settings")
public final class SettingsCommands {
    @Usage
    public void showSettings(BukkitSource source) {
        source.reply("User settings");
    }
}
```
**Result:**
- `/main` → Main command
- `/main admin ban` → Ban command
- `/main admin kick` → Kick command
- `/main user profile` → Profile command
- `/main user settings` → Settings command

**Why use complex inheritance chains?**
- To organize large sets of commands into logical groups
- To reuse command logic across different parts of your application
- To keep your codebase modular and maintainable

**Tip:**
Start with simple subcommands and add complexity only as your project grows. Deep or complex hierarchies should be well-documented and easy for users to navigate.

## Attachment Modes

Attachment Modes control where a subcommand appears in relation to its parent command's arguments. They let you decide if a subcommand comes before, after, or instead of the parent command's arguments.

Think of it as choosing where the subcommand "attaches" in the command path. This is especially useful for making your commands more natural and user-friendly.

There are three main attachment modes:

### 1. MAIN/UNSET (default)
The subcommand is attached **after the parent's required (main) arguments**. This is the default if you don't specify a mode.

```java
@Command("parent")
public class MyCommand {
    @Usage
    public void main(PlatformSource source, String text) {
        // /parent <text>
    }

    @SubCommand(value = "sub", attachment = AttachmentMode.MAIN)
    public void subMain(PlatformSource source, String text, Double decimal) {
        // /parent <text> sub <decimal>
        // 'sub' comes after the parent's required argument <text>
    }
}
```

### 2. DEFAULT
The subcommand is attached **after the parent's default (optional) arguments**.

```java
@Command("parent")
public class MyCommand {
    @Usage
    public void def(PlatformSource source, @Default("0") Integer num) {
        // /parent [num]
    }

    @SubCommand(value = "sub", attachment = AttachmentMode.DEFAULT)
    public void subDefault(PlatformSource source, @Default("0") Integer num, String text) {
        // /parent [num] sub <text>
        // 'sub' comes after the parent's optional argument [num]
    }
}
```

### 3. EMPTY
The subcommand is attached **directly to the parent**, ignoring all parent arguments.

```java
@Command("parent")
public class MyCommand {
    @Usage
    public void def(PlatformSource source, @Default("0") Integer num) {
        // /parent [num]
    }

    @SubCommand(value = "sub", attachment = AttachmentMode.EMPTY)
    public void subEmpty(PlatformSource source, String text) {
        // /parent sub <text>
        // 'sub' ignores all parent arguments and attaches directly
    }
}
```

**Summary Table:**
| Mode         | Example Command Path         | Description                                 |
|--------------|-----------------------------|---------------------------------------------|
| MAIN/UNSET   | `/parent <text> sub <dec>`  | Subcommand after parent's required args      |
| DEFAULT      | `/parent [num] sub <text>`  | Subcommand after parent's optional args      |
| EMPTY        | `/parent sub <text>`        | Subcommand directly after parent, no args    |

Attachment Modes help you design commands that feel natural and are easy for users to remember. Choose the mode that best fits how you want your commands to be structured!

### Conditional Subcommands

You can create conditional subcommands based on permissions or other logic:

```java
@Command("moderation")
public final class ModerationCommand {
    
    @SubCommand("ban")
    @Permission("moderation.ban")
    public void banCommand(BukkitSource source, @Named("player") Player player) {
        // Only accessible with permission
    }
    
    @SubCommand("warn")
    @Permission("moderation.warn")
    public void warnCommand(BukkitSource source, @Named("player") Player player) {
        // Only accessible with permission
    }
}
```

:::tip Pro Tip
Use subcommands to organize related functionality and create intuitive command structures. The inheritance system allows for maximum code reuse and maintainability.
:::

## Best Practices

1. **Use descriptive names** for subcommands that clearly indicate their purpose
2. **Group related functionality** under logical parent commands
3. **Consider user experience** when designing command hierarchies
4. **Use inheritance** to avoid code duplication across similar commands
5. **Apply consistent naming conventions** across your subcommand structure
6. **Document complex command structures** for easier maintenance 