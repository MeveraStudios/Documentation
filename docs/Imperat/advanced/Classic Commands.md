---
sidebar_position: 1
---

# Classic Commands

While Imperat's annotation-based approach is recommended for most use cases, the classic builder pattern provides maximum flexibility and control over command creation. This approach is ideal for dynamic command generation, complex conditional logic, or when you need fine-grained control over the command structure.

## Overview

The classic approach uses Imperat's fluent builder API to construct commands programmatically. This method gives you complete control over every aspect of command creation, from parameter definitions to execution logic.

## Basic Command Creation

### Creating a Simple Command

```java
Command<BukkitSource> exampleCommand = Command.create(imperat, "example")
    .description("A simple example command")
    .permission("command.example")
    .aliases("ex", "example2")
    .defaultExecution((source, context) -> {
        source.reply("Usage: /example <number>");
    })
    .usage(CommandUsage.<BukkitSource>builder()
        .parameters(CommandParameter.requiredInt("number"))
        .execute((source, context) -> {
            int number = context.getArgument("number");
            source.reply("You entered: " + number);
        })
    )
    .build();
```

:::info Command Structure
A command in Imperat is represented internally by the class `dev.velix.imperat.command.Command` which holds every command's data and needed usages.

Sub-commands are themselves `Command` instances - there's no separate `Subcommand` class. Subcommands are treated as commands and can be easily combined together in the form of a chain by merging the main-usage of a command to the subcommand's usage.

Moreover, a Command is also treated as a `CommandParameter` that can be added to a `CommandUsage`.
:::

### Registering the Command

```java
imperat.registerCommand(exampleCommand);
```

## Command Components

### Basic Properties

```java
Command<BukkitSource> command = Command.create(imperat, "mycommand")
    .description("My awesome command")           // Command description
    .permission("myplugin.mycommand")           // Required permission
    .aliases("mc", "mycmd")                     // Command aliases
    .build();
```

Every single Command object has the following mutable components:

- **Aliases** (other names could be used for a command)
- **Permission** 
- **Description**
- **Default-usage** (`/<command>` without any arguments)
- **Usages**
- **Processors**

### Default Execution

The default execution runs when no arguments are provided:

```java
command.defaultExecution((source, context) -> {
    source.reply("Usage: /mycommand <player> [amount]");
});
```

## Parameter Types

### Built-in Parameter Types

```java
// Required parameters
CommandParameter.requiredString("name")
CommandParameter.requiredInt("number")
CommandParameter.requiredDouble("decimal")
CommandParameter.requiredBoolean("flag")
CommandParameter.requiredPlayer("player")

// Optional parameters
CommandParameter.optionalString("message", "default message")
CommandParameter.optionalInt("amount", 1)
CommandParameter.optionalDouble("multiplier", 1.0)
CommandParameter.optionalBoolean("silent", false)
CommandParameter.optionalPlayer("target", null)
```

### Custom Parameter Types

```java
// With custom parameter type
CommandParameter.required("group", new GroupParameterType())

// With suggestion resolver
CommandParameter.required("player", new PlayerParameterType(), new PlayerSuggestionResolver())
```

### Complex Parameters

```java
// Arrays
CommandParameter.required("players", ParameterTypes.array(Player.class))

// Collections
CommandParameter.required("items", ParameterTypes.list(String.class))

// Maps
CommandParameter.required("scores", ParameterTypes.map(String.class, Integer.class))

// Optional with default provider
CommandParameter.optional("time", ParameterTypes.string(), 
    OptionalValueSupplier.of(() -> LocalTime.now().toString()))
```

## Command Usages

### Simple Usage

```java
command.usage(CommandUsage.<BukkitSource>builder()
    .parameters(
        CommandParameter.requiredPlayer("player"),
        CommandParameter.requiredInt("amount")
    )
    .execute((source, context) -> {
        Player player = context.getArgument("player");
        int amount = context.getArgument("amount");
        
        // Command logic here
        source.reply("Gave " + amount + " items to " + player.getName());
    })
);
```

### Usage with Description

```java
command.usage(CommandUsage.<BukkitSource>builder()
    .description("Give items to a player")
    .parameters(
        CommandParameter.requiredPlayer("player"),
        CommandParameter.requiredInt("amount")
    )
    .execute((source, context) -> {
        // Command logic
    })
);
```

### Usage with Permission

```java
command.usage(CommandUsage.<BukkitSource>builder()
    .permission("myplugin.give")
    .parameters(
        CommandParameter.requiredPlayer("player"),
        CommandParameter.requiredInt("amount")
    )
    .execute((source, context) -> {
        // Command logic
    })
);
```

## Subcommands

A normal usage usually has no special CommandParameter types (such as Command), which can be added easily as shown above.

However, what if you wanted to add subcommands? You can't add a subcommand directly through creating it manually (it's possible) as it will require a lot of processing and will be ugly looking.

Therefore, the Command object is made with such automated processing and chaining of subcommands through the method `Command#addSubCommandUsage` as shown below:

### Method 1: Using subCommand() Method

```java
command.subCommand("sub1",
    CommandUsage.<BukkitSource>builder()  
    .parameters(
        CommandParameter.optional("value", ParameterTypes.numeric(Double.class), OptionalValueSupplier.of("-1.0"))
    ).execute((source, context)-> {
        // You can get previously used arguments from the main command usage  
        Integer firstArg = context.getArgument("firstArg");  
        source.reply("Entered firstArg= " + firstArg);  
        Double value = context.getArgument("value");  
        assert value != null; // Optional arg can't be null if it has a default value supplier  
        source.reply("Double value entered= " + value);  
    })
);
```

### Method 2: Using Command Instance

Since subcommands are basically treated as `Command` instances, you can alternatively do something like this:

```java
command.subCommand(
    Command.create(imperat, "help")
        .usage(
            CommandUsage.<BukkitSource>builder()
                .parameters(
                    CommandParameter.optional("value", ParameterTypes.numeric(Double.class), OptionalValueSupplier.of("-1.0"))
                )
                .execute((source, context) -> {
                    // You can get previously used arguments from the main command usage  
                    Integer firstArg = context.getArgument("firstArg");  
                    source.reply("Entered firstArg= " + firstArg);  
                    Double value = context.getArgument("value");  
                    assert value != null; // Optional arg can't be null if it has a default value supplier  
                    source.reply("Double value entered= " + value);  
                })
        )
);
```

After the example above, a new usage internally will be created and shall look like `/example <firstArg> sub1 [value]`.

### Subcommand Options

There are multiple extra options to consider when adding a subcommand to a command:

- **`aliases`** - Add aliases for the subcommand
- **`attachment`** - How the subcommand attaches to the parent command (default: `MAIN` - attaches after parent's main parameters)

### Simple Subcommand Examples

```java
command.subCommand("give", CommandUsage.<BukkitSource>builder()
    .parameters(
        CommandParameter.requiredPlayer("player"),
        CommandParameter.requiredInt("amount")
    )
    .execute((source, context) -> {
        Player player = context.getArgument("player");
        int amount = context.getArgument("amount");
        source.reply("Gave " + amount + " items to " + player.getName());
    })
);

command.subCommand("take", CommandUsage.<BukkitSource>builder()
    .parameters(
        CommandParameter.requiredPlayer("player"),
        CommandParameter.requiredInt("amount")
    )
    .execute((source, context) -> {
        Player player = context.getArgument("player");
        int amount = context.getArgument("amount");
        source.reply("Took " + amount + " items from " + player.getName());
    })
);
```

**Main command with parameters:**
```java
command.usage(CommandUsage.<BukkitSource>builder()
    .parameters(CommandParameter.requiredPlayer("player"))
    .execute((source, context) -> {
        Player player = context.getArgument("player");
        source.reply("Player info for: " + player.getName());
    })
);
```

**Subcommand that inherits main command parameters:**
```java
command.subCommand("give", CommandUsage.<BukkitSource>builder()
    .parameters(CommandParameter.requiredInt("amount"))
    .execute((source, context) -> {
        Player player = context.getArgument("player"); // From main command
        int amount = context.getArgument("amount");    // From subcommand
        source.reply("Gave " + amount + " items to " + player.getName());
    })
);
```

## Processors

### Adding Processors

```java
command.preProcessor(new CommandPreProcessor<BukkitSource>() {
    @Override
    public void process(Context<BukkitSource> context) throws ImperatException {
        // Pre-execution logic
        if (!context.source().hasPermission("myplugin.admin")) {
            throw new SourceException("Insufficient permissions");
        }
    }
});

command.postProcessor(new CommandPostProcessor<BukkitSource>() {
    @Override
    public void process(ResolvedContext<BukkitSource> context) throws ImperatException {
        // Post-execution logic
        System.out.println("Command executed by: " + context.source().getName());
    }
});
```

## Advanced Examples

### Complex Command with Multiple Usages

```java
Command<BukkitSource> adminCommand = Command.create(imperat, "admin")
    .description("Administrative commands")
    .permission("admin.command")
    .aliases("a", "admincmd")
    .defaultExecution((source, context) -> {
        source.reply("Admin commands:");
        source.reply("/admin ban <player> [reason]");
        source.reply("/admin kick <player> [reason]");
        source.reply("/admin mute <player> <duration>");
    })
    .usage(CommandUsage.<BukkitSource>builder()
        .description("Ban a player")
        .permission("admin.ban")
        .parameters(
            CommandParameter.requiredPlayer("player"),
            CommandParameter.optionalString("reason", "No reason provided")
        )
        .execute((source, context) -> {
            Player player = context.getArgument("player");
            String reason = context.getArgument("reason");
            
            // Ban logic
            player.kickPlayer("You have been banned: " + reason);
            source.reply("Banned " + player.getName() + " for: " + reason);
        })
    )
    .usage(CommandUsage.<BukkitSource>builder()
        .description("Kick a player")
        .permission("admin.kick")
        .parameters(
            CommandParameter.requiredPlayer("player"),
            CommandParameter.optionalString("reason", "No reason provided")
        )
        .execute((source, context) -> {
            Player player = context.getArgument("player");
            String reason = context.getArgument("reason");
            
            // Kick logic
            player.kickPlayer("You have been kicked: " + reason);
            source.reply("Kicked " + player.getName() + " for: " + reason);
        })
    )
    .subCommand("mute", CommandUsage.<BukkitSource>builder()
        .description("Mute a player")
        .permission("admin.mute")
        .parameters(
            CommandParameter.requiredPlayer("player"),
            CommandParameter.requiredInt("duration"),
            CommandParameter.optionalString("reason", "No reason provided")
        )
        .execute((source, context) -> {
            Player player = context.getArgument("player");
            int duration = context.getArgument("duration");
            String reason = context.getArgument("reason");
            
            // Mute logic
            source.reply("Muted " + player.getName() + " for " + duration + " minutes: " + reason);
        })
    )
    .build();
```

### Dynamic Command Generation

```java
public Command<BukkitSource> createDynamicCommand(String name, List<String> features) {
    Command.Builder<BukkitSource> builder = Command.create(imperat, name)
        .description("Dynamic command with features: " + String.join(", ", features));
    
    for (String feature : features) {
        switch (feature) {
            case "teleport":
                builder.usage(CommandUsage.<BukkitSource>builder()
                    .parameters(CommandParameter.requiredPlayer("target"))
                    .execute((source, context) -> {
                        Player target = context.getArgument("target");
                        source.as(Player.class).teleport(target);
                        source.reply("Teleported to " + target.getName());
                    })
                );
                break;
            case "heal":
                builder.usage(CommandUsage.<BukkitSource>builder()
                    .parameters(CommandParameter.optionalPlayer("target", null))
                    .execute((source, context) -> {
                        Player target = context.getArgument("target");
                        if (target == null) {
                            target = source.as(Player.class);
                        }
                        target.setHealth(target.getMaxHealth());
                        source.reply("Healed " + target.getName());
                    })
                );
                break;
        }
    }
    
    return builder.build();
}
```

**Usage:**
```java
Command<BukkitSource> dynamicCommand = createDynamicCommand("dynamic", 
    Arrays.asList("teleport", "heal"));
```

## Best Practices

### 1. Command Structure

- **Clear naming**: Use descriptive command names
- **Consistent permissions**: Follow a hierarchical permission structure
- **Helpful descriptions**: Provide clear descriptions for help menus
- **Logical aliases**: Use short, memorable aliases

### 2. Parameter Design

- **Required first**: Put required parameters before optional ones
- **Logical order**: Arrange parameters in a logical sequence
- **Clear names**: Use descriptive parameter names
- **Appropriate types**: Choose the most specific parameter type

### 3. Error Handling

- **Validate inputs**: Check parameter values in execution
- **Clear messages**: Provide helpful error messages
- **Graceful failures**: Handle edge cases gracefully

### 4. Performance

- **Efficient logic**: Keep execution logic fast
- **Minimal allocations**: Avoid unnecessary object creation
- **Caching**: Cache frequently accessed data

## Comparison with Annotations

| Aspect | Classic | Annotations |
|--------|---------|-------------|
| **Flexibility** | Maximum | High |
| **Verbosity** | High | Low |
| **Dynamic creation** | Easy | Limited |
| **Runtime modification** | Possible | Not possible |
| **Learning curve** | Steeper | Gentle |
| **Code organization** | Manual | Automatic |

## When to Use Classic Commands

- **Dynamic command generation** based on configuration
- **Complex conditional logic** in command structure
- **Runtime command modification** requirements
- **Integration with external systems** that generate commands
- **Maximum control** over command behavior
- **Legacy code migration** from other frameworks

The classic approach provides the ultimate flexibility for command creation in Imperat, making it perfect for advanced use cases where you need complete control over the command lifecycle.

## Complete Example

Here's a complete example demonstrating all the features:

```java
Command<BukkitSource> exampleCommand = Command.create(imperat, "example")
    .description("A comprehensive example command")
    .permission("command.example")
    .aliases("ex", "example2")
    .defaultExecution((source, context) -> {
        source.reply("Usage: /example <number> [subcommand]");
    })
    .usage(CommandUsage.<BukkitSource>builder()
        .parameters(CommandParameter.requiredInt("number"))
        .execute((source, context) -> {
            int number = context.getArgument("number");
            source.reply("You entered: " + number);
        })
    )
    .subCommand("sub1",
        CommandUsage.<BukkitSource>builder()
        .parameters(CommandParameter.optional("value", ParameterTypes.numeric(Double.class), OptionalValueSupplier.of("-1.0")))
        .execute((source, context) -> {
            Integer firstArg = context.getArgument("number");
            Double value = context.getArgument("value");
            source.reply("Number: " + firstArg + ", Value: " + value);
        })
    )
    .build();

imperat.registerCommand(exampleCommand);
```

:::danger[CRITICAL]
- **DO NOT USE** `CommandUsage.Builder#build` to add an instance of a usage, it might break some internals, please return the builders.
- **NEVER CALL** `Command#setPosition` for any reason (even if you were [Joshua Bloch](https://en.wikipedia.org/wiki/Joshua_Bloch))
- If you don't know what is an ambiguity between 2 different usages, please check out [Usage Verification](Customizing%20Imperat.md#usage-verification)
::: 