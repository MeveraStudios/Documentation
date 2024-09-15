---
sidebar_position: 2
description: The platform-dependant api managing and controling commands and sources
---
:::note  
If you haven't checked out [Introduction](Imperat/Introduction.md) first, then please do before approaching this
:::

As we learned before, The `Imperat` interface main purpose is to handle all data about 
the commands you create and register. However, it's not the only purpose !
The `Imperat` interface is made of several components that are flexible *(changeable/can be implemented by your own subtypes)* and they are the following: 

- AnnotationParser
- PermissionResolver
- ContextFactory
- [Processors](Processors.md)
- [Value Resolver](Value%20Resolver.md)
- [Context Resolver](Context%20Resolver.md) 
- [Suggestion Resolver](Suggestion%20Resolver.md)
- [Command Help](Command%20Help.md)
- UsageVerifier
## AnnotationParser

It's a flexible abstract class in Imperat, which parses the annotated command classes.
it's used internally inside the method `Imperat#registerCommand(T instance)`.
Simply, It defines how the data from the annotations (inside your Command class) are translated and converted into command objects.

You can customize and make your own AnnotationParser as you wish by using `Imperat#setAnnotationParser(AnnotationParser<C>)` where C is automatically
your command-sender type

Refer to the java docs if you need more details on how to implement your own `AnnotationParser`, although I would never recommend you to do this, as the default `AnnotationParser` is competent enough.

:::warning
If you ever wanted to create your own implementation of `AnnotationParser` abstract class, 
you will not receive any support and your issue will be instantly ignored/discarded. It's merely your own responsibility.

:::
## Permission Resolver

According to [Supported-Platforms](Supported-Platforms.md) , each platform has it's own implementation of `Imperat` , therefore, each command dispatcher implementation identifies
it's own way of identifying whether the command-sender/source has a permission or not.

### Implementing your own Permission Resolver

If you ever wanted to make your own `Permission Resolver` you should consider
adding it as a parameter inside the `YourCommandPlatform.create()`, Refer to the java docs 
for more info about method parameters for creation of Imperat instances from various supported platforms and you may would like to check [Supported-Platforms](Supported-Platforms.md)

*Quick **Bukkit** example:*
```java
class MyBukkitPermissionResolver implements PermissionResolver<BukkitSource> {
  @Override
  public boolean hasPermission(
		@NotNull BukkitSource source,
		@Nullable String permission
  ) {
	CommandSender originalSender = source.getOrigin();
	return originalSender.hasPermission(permission);
  }
}

class MyPlugin extends JavaPlugin {
  private BukkitImperat imperat;
  @Override
  public void onEnable() {
	  //now you injected the your own instance of permission resolver into the   Command Dispatcher
	  imperat = BukkitImperat.create(plugin, new MyBukkitPermissionResolver());
  }
}
```
## Context
> *I know it sounds complex and difficult to understand, but it's really simple and easy once you understand what it is, so please be patient it will be worth it , trust me ;).*

**Frequently asked question:** What's a context (regarding commands) ?
**Answer:** It's an object that holds all information related to the current command being executed.

:::info[Summary]
 It holds the information that must be processed and resolved to execute the command with the proper argument values and order(including flags)

:::

There are 3 main types of `Context` 
- **Context** (plain)
- **SuggestionContext**
- **ResolvedContext**

### Plain Context
It's the context object created during the beginning of the command execution
it's used to hold all the necessary information regarding the command to execute.

### SuggestionContext
It's the context object created during tab-completion of a command, it holds t he necessary information
that would assist you in creating suggestions for arguments using [SuggestionResolver](Suggestion%20Resolver)

### ResolvedContext
It's the context object created to resolve the arguments input by the user into values to be used during `CommandExecution`
It's also used in `CommandPostProcessors`

:::info[Advanced Detail]
There's a 4th type of context which is `ExecutionContext` it acts as a middle interface between the plain
context and the ResolvedContext, it's used inside of `CommandExecution` to provide you with the methods you need
for executing your command properly.

:::

### Life Cycle of Context:

1. The context is created during the execution process of a command, to cache the raw input by the command source/sender into `ArgumentQueue` and the command being executed.

2. then the dispatcher fetches all the registered usages of the command being executed to find and look up the **MOST suitable/accurately-corresponding** `CommandUsage` that matches the user input.

3. Then a `ResolvedContext` is created using the previously created `Context` and the looked up `CommandUsage` then method `ResolvedContext#resolve` is called to resolve and parse the user input into arguments with values to provide the user with during the `CommandExecution`

## Context Factory

Simply, It's a built-in interface that defines how the `Context`, `SuggestionContext` and the `ResolvedContext` instances are created during the command-execution lifecycle

Creating and injecting your own `ContextFactory<C>` is easy , you just create a new class that implements `ContextFactory<YourPlatformSource>` then implement its three methods that define the creation of `Context` , `SuggestionContext`, and `ResolvedContext`, then you inject/register your context factory instance by calling `dispatcher#setContextFactory`

***Quick example:***
```java
dispatcher.setContextFactory(new YourContextFactory());
```
## UsageVerifier

It's an interface that verifies every usage of a command when registering that command into the dispatcher. It verifies  that a command usage created in the command object follows certain rules.
The built-in/default `UsageVerifier` has the following **rules** :

- A usage **MUST** have **AT LEAST ONE** **required parameter** at the beginning before any other  optional parameters <br/>
- If the usage doesn't have any subcommands, it must not be duplicated in a similar parameters pattern or sequence.

- It **MUSTN'T** have a greedy argument in the middle of the parameters,  therefore, if you want to add any greedy arguments,  you should put **A SINGLE (not multiple)** greedy argument at the END of the usage parameters list ONLY.
### Implementing your own usage verifier
To make your own rules or add new ones for the verification process, you should implement `UsageVerifier`, then implement it's two methods which are `verify` and `areAmbigious`

The `verify()` method is self-explanatory, simply checks if the each usage of a command follows certain rules.

The `areAmbigious(CommandUsage, CommandUsage)` method checks if any two usages of a command are indistinguishable.

####  Common Scenarios
Here are some important common scenarios that will help you better understand
how Imperat recognizes and when does it tolerate an ambiguity.
##### Scenario #1
if you have the command `group` and it has 2 usages which are `/group <group>` and `/group help` , an actual group can be called **'help'**. Luckily however, Imperat prioritizes subcommands compared to value arguments, so the dispatcher will tolerate this pseudo-ambiguity. <br/>
##### Scenario #2
If you have the command `buy` with 2 usages which are `/buy <itemId>` and `/buy <itemName>` 
Even if both parameters `itemId` and `itemName` are of different types, the current `Imperat` cannot tolerate this ambiguity coming from these 2 usages.

:::warning
We don't recommend implementing your own UsageVerifier, unless you know what you're doing, since the `DefaultUsageVerifier` is competent enough.

:::

:::danger[Important]
If you create and use your own implementation of `UsageVerifier` interface, 
 you will not receive any support and your issue will be instantly ignored/discarded. 
 It's merely your own responsibility. 

:::

Quick example on implementing your own `UsageVerifier`:
```java
class MyUsageVerifier implements UsageVerifier<YourPlatformSource> {
 
  @Override
  public boolean verify(CommandUsage<YourPlatformSource> usage) {
	//prevents any usage to be accepted if it has a flag
	return usage.getParameter(CommandParameter::isFlag) != null;
  }
  
  @Override
  public boolean areAmbigious(
	  CommandUsage<YourPlatformSource> usage1,
	  CommandUsage<YourPlatformSource> usage2
  ) {
	//check if the two usages are duplicates
  //this is not accurate but it's just a demonstration
	return usage1.equals(usage2);
  }
}
```

#### Setting your usage verifier
```java
dispatcher.setUsageVerifier(new MyUsageVerifier);
```
