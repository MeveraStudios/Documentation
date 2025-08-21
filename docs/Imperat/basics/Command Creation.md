---
sidebar_position: 2
---

# Command Creation

Imperat provides two powerful ways to create commands: **Annotations** and **Classic Builders**. This section focuses on the recommended **Annotations approach** for its simplicity and expressiveness.

## Annotations Approach (Recommended)

Creating commands with annotations is the most straightforward and readable approach. It requires only two simple steps:

1. **Create a class** that will represent your command
2. **Add annotations** to identify it as a command and define its behavior

### Basic Example

```java
@Command("example")  
public final class ExampleCommand {

  @Usage  
  public void defaultUsage(BukkitSource source) {  
   source.reply("This is just an example with no arguments entered");  
  }  

  @Usage  
  public void exampleOneArg(
	  BukkitSource source, 
	  @Named("firstArg") int firstArg
  ) { 
   source.reply("Entered required number= " + firstArg);  
  }
}
```

### Key Benefits

- **Declarative**: Express your command structure through annotations
- **Type-safe**: Compile-time validation of your command structure
- **Readable**: Clear and intuitive syntax
- **Maintainable**: Easy to modify and extend

### Registration

Register your annotated command with a single line:

```java
imperat.registerCommand(new ExampleCommand());
```

## Types of Usages

A **usage** is a specific way a command (or subcommand) can be executed, defined by the sequence of arguments or input it expects. 

Think of a usage as a "recipe" for how to use a command - it tells you exactly what arguments you need to provide and in what order. A usage can require no arguments (empty), only optional arguments, or one or more required arguments.

Each usage is linked to a command or subcommand, and determines what input the user must provide for a certain action to be performed. When a user types a command, Imperat looks at the arguments they provided and matches them to the appropriate usage.

Since subcommands are also commands, they can have their own usages just like root commands. This means you can have complex command structures where each level has its own set of possible usages.

For example, if you have a command `/admin ban <player>`, the usage requires one required argument (the player name). If you have `/admin kick <player> [reason]`, this usage requires one argument (player) and has one optional argument (reason).

:::info Usage Priority
Imperat automatically determines the usage type based on your parameter annotations:
- **EMPTY**: No parameters (except source)
- **DEFAULT**: Only optional parameters
- **MAIN**: At least one required parameter
:::

:::note
Imperat is designed to parse nested class components without any limits.
You can create nested classes to represent other root commands or even subcommands of the parent root class.
:::

## Classic Approach

For advanced use cases or when you need more control over the command creation process, Imperat also provides a classic builder approach using `Command.create()`.

:::tip[Learn More]
For detailed information about all available annotations and their usage, see the [Annotations Deep Dive](Annotations%20Deep%20Dive.md).

For the classic builder approach, see the [Classic Commands](../advanced/Classic%20Commands.md).
:::

## Next Steps

Now that you understand the basics of command creation, explore the following topics:

- **[Annotations Deep Dive](Annotations%20Deep%20Dive.md)** - Learn about every annotation available
- **[Subcommands](Subcommands.md)** - Master hierarchical command structures
- **[Parameter Types](Parameter-Type.md)** - Understand how to handle different parameter types
- **[Dependency Injection](Dependency%20Injection.md)** - Learn how to inject dependencies into your commands 