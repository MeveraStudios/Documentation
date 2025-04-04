---
title: Imperat
slug: /Imperat
id: Introduction
sidebar_position: 1
---
import DocCardList from '@theme/DocCardList';

# Introduction
Imperat is a powerful command dispatching framework, it allows you to create 
commands and converts them into the form of multiple data-condensed objects like `Command`,  `CommandUsage` and `CommandParameter`
These objects are registered/injected into the class `Imperat` which handles all information about each command and then dispatches/executes the command requested.

# Initiazling your Imperat

**Frequently asked question:** ***What's a command dispatcher/Imperat ??*** <br/>
**Answer:** It's the Ultimate class handling all data needed when processing and registering
commands objects (`Command`).
You have to create **new instance** of the imperat.
on the **start** of your platform by calling `YourPlatformImperat#builder` (the method is static) to configure your imperat instance,
then finally end the chain with `build` method to return a new instance of `YourPlatformImperat` type.

:::tip[TIP]
Creation of an instance of your `PlatformImperat` depends mainly on which platform
you are using. For more details, Check out [Supported-Platforms](Supported-Platforms.md)
But despite having various types of imperat implementations for different platforms,
all of them are **configurable/customizable**
:::


# Creation of Commands
There's mainly 2 ways of creating commands:
- [Annotations Command API](command-api/Annotations%20Command%20API.md) 
- [Classic (Built-in `Command.create(commandName)`)](command-api/Classic%20Command%20API.md)

I will be giving an intro to the easier way for creating commands which is the annotations.

## Annotated Commands
Creating commands with annotations is easy with 2 steps only:
1. Create a class that will represent your command class
2. Add unique annotations to it that allows the dispatcher to identify it as a command class

*Quick example (Same results as the one above, but with annotations):*
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

For more details about what to use instead of `BukkitSource` you should use, please check out [Supported platforms](Supported-Platforms.md)

# Register your commands
Register your command by calling the method `imperat.registerCommand(command)` 
**Note:** the method is called from the `YourPlatformImperat` instance that you should have created

Here's a quick bukkit example:
```java
public class YourPlugin extends JavaPlugin {

  private BukkitImperat imperat;

  @Override
  public void onEnable() {
    //initializing imperat
    imperat = BukkitImperat.builder(plugin).build();

    //registering the command
    imperat.registerCommand(new ExampleCommand());
  }

}
```

# Customizing Imperat

If you wanted to register a [Context Resolver](Context%20Resolver.md) or a [Parameter Type](Parameter-Type.md) , or even 
set a [Suggestion Resolver](Suggestion%20Resolver.md) for tab-completion in commands, You would have to 
call some methods while configuring imperat.

With Imperat, you can even register your own sender/source type, check out [Source Resolver](Source%20Resolver.md)
For a complete detailed guide on this, please check out [Dispatcher API](Dispatcher%20API.md)

*Quick-example:*
```java
BukkitImperat imperat = BukkitImperat.builder(plugin)
.parameterType(Arena.class, new ArenaParameterType()) //registering custom type 'Arena'
.parameterType(Kit.class, new KitParameterType()) //registering custom type 'Kit'
.parameterType(DuelMode.class, new DuelModeParameterType()) //registering custom type 'DuelMode'
.sourceResolver(CustomSource.class, CustomSource::new) //registering custom command sender/source type 'CustomSource'
.build();
```

:::warning
If you ever wanted to create your own implementation of `Imperat` interface, 
you will not receive any support and your issue will be instantly ignored/discarded
:::

# Tutorials
Check out all the Imperat tutorials here!

<DocCardList />