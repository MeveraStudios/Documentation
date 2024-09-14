---
sidebar_position: 1
---
# Classic Command API

A command in Imperat is represented internally by the class dev.velix.imperat.command.Command which holds every command's data and needed usages. 

Sub-commands at the other hand, are themselves `Command`, simply there's no class called Subcommand or something like that, Subcommands are treated as commands and can be easily combined together in the form of a chain by merging the main-usage of a command to the subcommand's usage.

Moreover, A Command is also treated as a CommandParameter that can be added to a CommandUsage.

We will be learning every possible way of modifying the Command object you create (**Classic**)
But first let's get to know the Mutable components of a command.

Every single Command object has the following mutable components :-

- **Aliases** (other names could be used for a command)
- **Permission** 
- **Description**
- **Default-usage** (/<command> without any arguments )
- **Usages**
- **Processors** 

## Example 

Here we will be creating our command builder instance :
```java
var command = Command.<YourPlatformSource>createCommand("example");
```
### Adding aliases 

We want our command to have more than one identifiable name.
```java
command.aliases("example2", "example3", "example4", "example5");
```

### Setting Command Permission
We can easily define a permission for our command as the example below:
```java
command.permission("command.example.permission");
```

### Setting Command Description
Same as before but using different method
```java
command.description("This is an example command !");
```

### Setting default-usage-executor
Now we want to define what happens when the command sender executes the command in the command-line without any arguments.
```java
command.defaultExecution((source, context)-> {  
  source.reply("This is just an example with no arguments entered");  
});
```

### Adding your Processors
:::caution[WARNING]
If you don't know what is a CommandProcessor, please check out [Command Processors](Command%20Processors.md)

:::

It's easy to add post and pre processors as example below
```java
command.preprocessor(new YourCommandPreProcessor())
	   .postProcessor(new YourCommandPostProcessor());
```

### Adding Command Usages
A normal usage usually has no special CommandParameter types(such as Command), 
which can be added  easily as below:
```java
command.usage(CommandUsage.<YourPlatformSource>builder()  
	.parameters(
	  	CommandParameter.requiredInt("firstArg")  
	).execute((source, context) -> {  
	 	Integer firstArg  = context.getArgument("firstArg");  
	 	source.reply("Entered required number= " + firstArg);  
	})  
);
```

However, what if you wanted to add subcommands, you cant add a subcommand directly through
creating it manually(it's possible) as it will require a lot of processing and will be ugly looking.

Therefore, The Command object is made with such automated processing and chaining of subcommands through the method Command#addSubCommandUsage as the example below :-

```java
command.subCommand("sub1",
 	CommandUsage.<YourPlatformSource>builder()  
	.parameters(
		CommandParameter.optional("value", Double.class,OptionalValueSupplier.of(-1D))
	).execute((source, context)-> {
	 	//you can get previously used arguments from the main command usage  
	 	Integer firstArg = context.getArgument("firstArg");  
	 	source.reply("Entered firstArg= " + firstArg);  
	 	Double value = context.getArgument("value");  
	 	assert value != null; //optional arg cant be null, it has a default value supplier  
	 	source.reply("Double value entered= " + value);  
	})
);
```

After the example above, a new usage internally will be created and 
shall look like /example <firstArg> sub1 [value].
#### Extras
There are multiple extra options to consider when adding a subcommand to a command :-
- `aliases`
- `attachDirectly` -> Whether the subcommand usage will be merged with the command's default usage (not main usage), and it's false by default, as it will cause  some ambiguity 

- You can also declare a usage to be executed asynchronously by using the method CommandUsage.Builder#coordinator which takes a CommandCoordinator instance.
as shown below:
```java
usageBuilder.coordinator(CommandCoordinator.async());
```

- You can add a cooldown per command usage as the example below:
```java
usageBuilder.cooldown(1, TimeUnit.SECONDS); //cooldown of 1 second
```

<br/>

:::danger[CRITICAL]
- DO NOT USE CommandUsage.Builder#build to add an instance of a usage, it might break some internals, please return the builders.
- **NEVER CALL** Command#setPosition for any reason (even if you were [Joshua Bloch](https://en.wikipedia.org/wiki/Joshua_Bloch))
- If you don't know what is an ambiguity between 2 different usages,
  please check out [UsageVerifier](../Dispatcher%20API.md#usageverifier)

:::