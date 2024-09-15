---
sidebar_position: 5
---
# Value Resolver

It's an interface that aims to define how the raw argument entered by the command-source/sender
is parsed and converted into a value of specific type; That specific type is defined by the generic type parameter `<T>` , if the raw input entered doesn't match the logic you set , then an exception shall be thrown inside of the `ValueResolver#resolve` 

>If you want to create your own exceptions you should check [Throwables](Throwables.md) ,
>Otherwise we will be using the built-in `SourceException` in our examples.

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
            Context<BukkitSource> context,
            CommandParameter parameter,
            Cursor cursor,
            String raw
    ) throws ImperatException {
        
        var sender = context.getSource();
        if (sender.isConsole()) {
            throw new SourceException("Only players can do this !");
        }
        
        var playerGroup = GroupRegistry.getInstance()
                .getGroup(sender.as(Player.class).getUniqueId());
        
        if(playerGroup == null) {
            throw new SourceException("Invalid group '%s'", raw);
        }
        
        return playerGroup;
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

	@Usage  
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

then we start registering our command, please refer to [Introduction](Introduction.md) to know how to register your commands whether they were made using annotated or classic ways .