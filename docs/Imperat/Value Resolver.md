---
sidebar_position: 5
---
It's an interface that aims to define how the raw argument entered by the command-source/sender
is parsed and converted into a value of specific type; That specific type is defined by the generic type parameter `<T>` , if the raw input entered doesn't match the logic you set , then a `CommandException` shall be thrown inside of the `ValueResolver` 

>If you want to create your own exceptions you should check [Command Exceptions](Command%20Exceptions) ,
>Otherwise we will be using the built-in `ContextResolveException` in our examples.

So if you want to add parameters to usages with custom types, you will need to create a value resolver for each custom type.

then want to add a parameter of type `X` , you must create and register your own value  resolver that will be responsible of converting the (String) raw argument/input by the user , into a Group object instance (value) to be provided during execution.

### Bukkit example: 

we create a class(record) called `Group` that has a field called `name` as below: 
```java
public record Group(String name) {}
```

we create the value resolver for type `Group` as below:
```java
public final class GroupValueResolver implements BukkitValueResolver<Group> {  
   @Override  
  public Group resolve(  
      Source<CommandSender> source,  
      Context<CommandSender> context,  
      String raw,
      Pivot pivot,
      CommandParameter parameter
  ) throws CommandException {  
	   var sender = context.getSource();  
	   if(sender.isConsole()) {  
		throw new ContextResolveException("Invalid group '%s'", raw);  
	   }   
	   return GroupRegistry.getInstance().getGroup(
				sender.as(Player.class).getUniqueId()
		);  
   }
}
```

Then we register the our value resolver as below:
`dispatcher.registerValueResolver(Group.class, new GroupValueResolver());`

Then we will be able to get the group value resolved from it's raw argument
during execution of a `CommandUsage` as below : 

#### Classic example:

```java
Command<CommandSender> senderCommand = Command.createCommand("group");  
senderCommand.setDefaultUsageExecution((source, context)-> {  
  source.reply("/group <group>");  
});  
  
senderCommand.addUsage(  
	CommandUsage.<CommandSender>builder()  
	 .parameters(CommandParameter.required("group", Group.class))  
	 .execute((source, context)-> {  
	  Group group = context.getArgument("group");  
	  assert group != null;  
	  source.reply("entered group name= " + group.name());  
	 })
	 .build()
);
```
#### Annotations example:

```java
@Command("group")  
public final class GroupCommand {  

	@DefaultUsage  
	public void defaultUsage(BukkitSource source) {  
		//default execution = no args  
		source.reply("/group <group>");  
	}
 
	@Usage  
	public void mainUsage(
		BukkitSource source,
		@Named("group") Group group
	){  
		//when he does "/group <group>"  
		source.reply("entered group name= " + group.name());  
	}
}
```

then we start registering our command, please refer to [Introduction](Imperat/Introduction.md) to know how to register your commands whether they were made using annotated or classic ways .