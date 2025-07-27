---
sidebar_position: 4
---
# Processors

:::caution[WARNING]
We have already talked about the life cycle of `Context` object during the command's execution
If you haven't read that yet, please try reading about the [Context System](Customizing%20Imperat.md#context-system) in the Customizing Imperat guide.
as the explanation below will be fully based on this.

:::

**Frequently asked question:** What are Processors in Imperat ? 
**Answer:-**
They are interfaces that define processes to happen right before the command execution.
These processes can be validations such as permission checking or cooldown checks.

Processors are classified into :
- **Global processors**
- **Command processors**

**Global** means that they for every command in general, while `Command processors` means that the processors are processing for specific command only.

There are 2 types of processors (whether global or not) :
- **Pre-processors**
- **Post-processors**

## Preprocessors
The prefix in their name `Pre` means `Before` which indicates the fact that the process happens **BEFORE** context resolving.
and that's why it has just `Context` inside of it's method.

## Postprocessors
The prefix in their name `Post` means `AFTER` which indicates the fact that the process happens **AFTER** context resolving
therefore, it has `ResolvedContext` instead of just `Context` inside of it's method.



:::tip[Pro Tip]
You can create a validation check , and when it fails you can stop the runtime of the command execution 
by throwing a exception.
for more details on exceptions, check [Error Handler](../basics/Error-Handler.md)

:::

## Registering processors
All registrations are within the `Imperat` api/dispatcher object. 

### Registering Global processors
you can register processors globally by calling `imperat#registerGlobalPreProcessor` for registering pre processors and/or 
`imperat#registerGlobalPostProcessor` for registering post processors.

#### Preprocessor example:
```java
public class ExamplePreProcessor implements CommandPreProcessor<BukkitSource> {
    @Override
    public void process(Imperat<BukkitSource> imperat, Context<BukkitSource> context, CommandUsage<BukkitSource> usage) throws ImperatException {
        if(context.source().isConsole()) {
            throw new SourceException(SourceException.ErrorLevel.SEVERE, "Only players are allowed to do this !");
        }
    }
}
```

#### Postprocessor example:
```java
public class ExamplePostProcessor implements CommandPostProcessor<BukkitSource> {
    @Override
    public void process(Imperat<BukkitSource> imperat, ResolvedContext<BukkitSource> context) throws ImperatException {
        String executorName = context.source().isConsole() ? "CONSOLE" : context.source().name();
        String executedCommandLine = "/" + CommandUsage.format(context.label(), context.getDetectedUsage());
        Bukkit.getConsoleSender().sendMessage(executorName + " has executed '" + executedCommandLine + "'");
    }
}
```

#### Registering your global processors
Quick example:
```java
imperat = BukkitImperat.builder(plugin)
    .preProcessor(new ExamplePreProcessor())
    .postProcessor(new ExamplePostProcessor())
    .build();
```

### Registering Command processors
We have already discussed that in the Classic Commands section and for annotations in [Annotations Deep Dive](../basics/Annotations%20Deep%20Dive.md).