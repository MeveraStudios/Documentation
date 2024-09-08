---
sidebar_position: 6
---
Unlike the [Value Resolver](Value%20Resolver.md), the context resolver resolves a value that is NOT DIRECTLY from the input, however the value is created from the context by a certain logic you specify.

:::tip
If you don't know what is a context or any other keywords used in this section, 
please refer to [Introduction](Imperat/Introduction.md) then [Dispatcher API](Dispatcher%20API.md) to become well-oriented of the framework's necessary basics.
:::

Therefore, instead of writing a lot of local variables to use inside of your command-execution repeatedly, you will be able to obtain them automatically without the need for boiler-plate code. 
### Example Bukkit Scenario: 

if you're creating a guild command that will have a lot of sub commands such as :
`/guild disband`
`/guild invite <player>`
`/guild kick <player>`
In each subcommand's execution , you will need to create a local variable for the `Guild` object
which belongs to the command-source/sender, so that you can operate on the `Guild` object by
removing/adding members or even deleting the guild of the command-source.

Since the `Source` is a part of the Context of a command, therefore we call that argument/value **a Context-Aware/Context-Resolved** value, as we deduced/created this value from the data related to the context of the command being executed.

So instead of repeating ourselves in each sub-command's execution, we will just have to create a `ContextResolver` for the type `Guild` as in the example below:

```java
public final class GuildContextResolver implements BukkitContextResolver<Guild> {  

  @Override  
  public @Nullable Guild resolve(  
		@NotNull Context<CommandSender> context,  
		@Nullable Parameter parameter  //null if classic way is used
  ) throws CommandException {  

   var source = context.getSource();  
   if(source.isConsole()) {  
	throw new ContextResolveException("Only a player can do this !");  
   }

   Player player = source.as(Player.class);  
   return GuildRegistry.getInstance().getUserGuild(player.getUniqueId());

  }

}
```

#### Registering the context resolver

It's simple, all you have to do is call method `Imperat#registerContextResolver`
for a specific type of object as the example below: 

```java
dispatcher.registerContextResolver(Guild.class, new GuildContextResolver());
```

#### Using the context resolver

It differs depending on which way you're creating your commands **(classic or annotations)**:
##### Classic
You should be able to automatically get the context resolved value from the `Context` object provided to you during command execution as follows:

```java
guildCmd.addSubCommandUsage("disband", CommandUsage.<CommandSender>builder()  
		.parameters() //no parameters in usage '/guild disband'  
		.execute((source, context)-> {  
		  //getting our context resolved Guild object's instance  
		  Guild guild = context.getContextResolvedArgument(Guild.class);  
		  if (guild == null) {  
			//user has no guild  
			// do something,
			// or you can process it
			// to do something in the ContextResolver by making use of exceptions
			return;  
		  }
		  guild.disband();  
		  source.reply("You have disbanded your guild successfully !!");  
		}).build()
```

##### Annotations
You should be able to do the same while having slightly more advantage than classic
you will be able to obtain the context resolved values as parameters inside of  your usage methods
as in the example below: 

```java
@SubCommand("disband")  
public void disband(BukkitSource source, Guild guild /*Context resolved*/) {  
	if (guild == null) {
		source.reply("HAHA YOU HAVE NO GUILD !");  
		//user has no guild  
		//do something,
		// or you can process it   
		// to do something in the ContextResolver by making use of exceptions
		return;  
	}
	guild.disband();  
	source.reply("You have disbanded your guild successfully !!");  
}
```
