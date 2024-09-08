---
sidebar_position: 4
---
Most exceptions thrown in Imperat extends the abstract class `CommandException` which represents an exception issued by Imperat itself, most exceptions are handled by sending a message to the command-source such as the built-in `ContextResolveException`

If you would like to create your own exception, then you should create a class that extends `CommandException` then implement the method `handle` which is called when the exception you throw is caught internally during runtime of Imperat, it specifies what's going to happen when this exception is caught.

**Quick-example:**

```java
public final class ExampleCustomException extends CommandException {  
  
	public ExampleCustomException(String msg) {  
	   super(msg);  
	}  

	@Override  
	public <C> void handle(Context<C> context) {  
	   var source = context.getSource();  
	   source.reply(Component.text(msg, NamedTextColor.RED));  
	}  
}
```

then you should be able to throw a `ExampleCustomException` inside of your execution 
or even inside of a [Context Resolver](Context%20Resolver.md) and/or [Value Resolver](Value%20Resolver.md) and then when the exception is caught 
during the runtime , it will call the method `handle` and executes it.