---
title: Error Handler
sidebar_position: 9
---
# Error Handler
~
The `ThrowableHandler` is a core component in the Imperat framework, designed to manage exceptions that occur during command execution.

The `ThrowableHandler` associates exception types with `ThrowableResolver`—a functional interface that provides a resolution strategy for the exception.

Therefore, Imperat knows how to handle each type of exceptions occuring by having a `ThrowableResolver` assigned to that type of exception.


## What is a `ThrowableResolver`?
Its a way to simply tell Imperat what to do when a specific exception is thrown
during the execution.

An exception can be **SelfHandled** which means they simply tell Imperat how to deal with them when they are thrown, their handling or resolvation comes with its instance basically,
Or a **Non-SelfHandled** exception which means they would need an external `ThrowableResolver` to be assigned to Imperat to be handled properly.

## SelfHandled Exceptions

SelfHandled exceptions are custom exceptions that extend the `SelfHandledException` class (which itself extends `ImperatException`). These exceptions include a `handle` method, where custom logic is defined to handle the error. 

This pattern encourages users to create their own exceptions by extending `SelfHandledException`, ensuring that when these exceptions are thrown, they resolve themselves via the `handle` method.

```java
public final class ExampleCustomException extends SelfHandledException {

    private final String message;

    public ExampleCustomException(String message) {
        this.message = message;
    }

    @Override
    public <S extends Source> void handle(Imperat<S> imperat, Context<S> context) {
        var source = context.source();
        source.reply("&c" + message); //message colored in red on bukkit platform
    }
}
```

In the example above, the custom exception `ExampleCustomException` displays a message in red when thrown. The `handle` method allows developers to define how the exception should be processed and handled when thrown.

Therefore, it will not require to be registered or to have a throwable resolver for it.

:::info Usage Tip
When defining custom exceptions, you can extend `SelfHandledException` and override the `handle` method to dictate exactly how the exception is resolved within the framework's runtime.
:::

:::note
SelfHandled exceptions should NOT be registered as throwable resolvers.
:::

## Non-SelfHandled Exceptions

For exceptions that **do not** extend `SelfHandledException`, the Imperat framework uses the `ThrowableResolver` to resolve them. These can be any standard Java exceptions or other custom ones that the user chooses not to self-handle.

Let's create our non-selfhandled exception:
```java
public final class ExampleCustomException extends ImperatException {

    private final String message;

    public ExampleCustomException(String message) {
        super(message);
    }

    public String getMessage() {
        return message;
    }
}
```

:::tip
Most default exceptions in Imperat extends `ImperatException`, when creating your own exception,
its a good practice to make it inherit from `ImperatException`.
:::


### Registering Non-SelfHandled Exceptions

To register a `ThrowableResolver` for a non-SelfHandled exception, use the `ConfigBuilder#throwableResolver` method

```java
imperat = BukkitImperat.builder(plugin)
    .throwableResolver(
        ExampleCustomException.class,
        (exception, context) -> context.source().reply("&c" + exception.getMessage())
    )
    .build();
```

### PermissionDeniedException Example

```java
imperat = BukkitImperat.builder(plugin)
    .throwableResolver(
        PermissionDeniedException.class,
        (exception, context) -> context.source().error("You don't have permission to use this command!")
    )
    .build();
```
In this example, whenever a `PermissionDeniedException` is thrown, the resolver sends an error message to the source. This allows for a centralized error handling mechanism for all non-SelfHandled exceptions of specific type..

#### Exception Handling Classes
Alternatively, you can create a class that declares method, and each
method defines a way to handle a specific type of exception.
This is done by annotating the methods with `@ExceptionHandler`, and ensuring the correct
parameters type and order as the example below:
```java
public class MyExceptionHandler {

    @ExceptionHandler(PermissionDeniedException.class)
    public void handleNoPerm(PermissionDeniedException ex, Context<YourPlatformSource> context) {
        context.source().error("You don't have permission to use this command!")
    }

}
```

The registration for external exception handling classes
is done after the initialization of your `Imperat` instance as follows:

```java
imperat = ...;
imperat.registerThrowableHandler(new MyExceptionHandler());
```

#### Per Command Exception Handlers
You can specify exception-handlers that work only when the specific exception is thrown during the execution
of a specific command.
You can easily achieve that by adding exception-handling methods in your annotated
command class as the following example:
```java
@Command("example")
public class ExampleCommand {

    @ExceptionHandler(PermissionDeniedException.class)
    public void handleNoPerm(PermissionDeniedException ex, Context<YourPlatformSource> ctx) {
        var src = ctx.source();
        src.reply("Failed to run command '/" + ctx.command() + "'");
        src.reply("You lack the permisison: '" + ex.getLackingPermission() + "'");
    }

}
```

:::info
When an exception is thrown, Imperat checks if it has a resolver for the root-command being executed,
if it does, it will handle it using the command's resolver, Otherwise, it will look for a resolver from the
central `ThrowableHandler` in Imperat's instance for a suitable throwable resolver for the type of exception thrown.
:::

Exceptions can carry contextual data to provide detailed information about what went wrong. The `PermissionDeniedException` is a perfect example, as it encapsulates three crucial pieces of information:

- **Command Usage**: The specific command or usage pattern that was attempted
- **Restricted Parameter**: The exact parameter or argument that triggered the permission check
- **Missing Permission**: The specific permission node that the sender lacks to execute the command

This rich contextual information allows developers to create more informative error messages and helps users understand exactly what permissions they need to perform the desired action. The specific data and context provided will vary depending on the exception type, with each exception class designed to carry the most relevant information for its particular error scenario.

:::caution Error Control
It's important to register resolvers for critical exceptions to prevent your command runtime from being interrupted by uncaught errors.
:::

## Built-in Exception Classes

Imperat provides a comprehensive set of built-in exception classes that handle various error scenarios during command execution. These exceptions are automatically thrown by the framework when specific conditions are met.

:::info Exception Categories
- **Runtime Exceptions**: Occur during plugin/application startup and prevent the plugin from enabling
- **Execution Exceptions**: Occur during command execution and registration
- **Parse Exceptions**: Occur during argument parsing and validation
- **Flag Exceptions**: Occur during flag processing and validation
- **Help Exceptions**: Occur during help system operations
- **Source/Permission Exceptions**: Occur during access control validation
:::

### Source & Permission Exceptions

| Exception | Type | Purpose | When It Occurs |
|-----------|------|---------|----------------|
| `OnlyPlayerAllowedException` | Execution | Restricts command execution to players only | When a console attempts to execute a command that requires a player source (in any platform other than CLI) |
| `PermissionDeniedException` | Execution | Handles permission-based access control | When the source doesn't have the required permission for executing a usage, subcommand, parameter, or command |
| `InvalidSyntaxException` | Execution | Handles command syntax errors | When user enters arguments that don't match any usage pattern (missing args, wrong format) |

### Cooldown Exceptions

| Exception | Type | Purpose | When It Occurs |
|-----------|------|---------|----------------|
| `CooldownException` | Execution | Manages command cooldown restrictions | When a user attempts to execute a command while still in cooldown from a previous usage |

### Flag-Related Exceptions

| Exception | Type | Purpose | When It Occurs |
|-----------|------|---------|----------------|
| `MissingFlagInputException` | Execution | Validates flag input requirements | When a user enters a true flag without its required input (e.g., `/test -x` where usage is `/test [-x <flag-input>]`) |
| `ShortHandFlagException` | Execution | Ensures consistent flag types | When user enters a mix of shorthand flags that are not of the same type (all must be switches OR true flags with same input data type) |
| `UnknownFlagException` | Execution | Validates flag existence | When a flag entered is of unknown origin (not a required flag or registered free-flag) |

### Parse Exceptions

| Exception | Type | Purpose | When It Occurs |
|-----------|------|---------|----------------|
| `InvalidNumberFormatException` | Parse | Validates numeric input | When a non-numerical value is entered for a parameter of numeric type |
| `InvalidBooleanException` | Parse | Validates boolean input | When an invalid boolean value is entered for a boolean parameter |
| `InvalidEnumException` | Parse | Validates enum input | When an invalid enum value is entered for an enum parameter |
| `ValueOutOfConstraintException` | Parse | Validates constrained values | When a parameter annotated with `@Values` receives a value outside the allowed set |
| `InvalidMapEntryFormatException` | Parse | Validates map entry format | When map parameter arguments have invalid format (wrong separator, missing value, etc.) |
| `WordOutOfRestrictionsException` | Parse | Validates word restrictions | When a parameter annotated with `@Word` receives a word outside the allowed restrictions |
| `InvalidUUIDException` | Parse | Validates UUID format | When a user enters an invalid UUID format for a UUID parameter |
| `NumberOutOfRangeException` | Parse | Validates numeric ranges | When a number entered for a parameter annotated with `@Range` is outside the specified range |

### Help-Related Exceptions

| Exception | Type | Purpose | When It Occurs |
|-----------|------|---------|----------------|
| `NoHelpException` | Execution | Handles missing help content | When there are no usages to display for the user (rare occurrence) |
| `NoHelpPageException` | Execution | Validates help page numbers | When the entered help page number is below minimum or above maximum in a `PaginatedHelpTemplate` |

### Runtime Exceptions

| Exception | Type | Purpose | When It Occurs |
|-----------|------|---------|----------------|
| `UsageRegistrationException` | Runtime | Validates command usage rules | During application startup when registering a usage that doesn't follow rules set in [Customizing Imperat](../advanced/Customizing%20Imperat.md#usage-verification) |
| `InvalidSourceException` | Runtime | Validates source types | During class parsing when an unknown type is set as the source for a usage/command/subcommand method |
| `AmbiguousUsageAdditionException` | Runtime | Prevents ambiguous usages | When registering a usage very similar to an already registered usage of the same root command |
| [`UnknownDependencyException`](Dependency%20Injection.md#error-handling) | Runtime | Handles dependency resolution failures | When a dependency cannot be resolved (dependency resolver returns null or no resolver is registered) |

### Self-Handled Exceptions

| Exception | Type | Purpose | When It Occurs |
|-----------|------|---------|----------------|
| `SelfHandledException` | Base | Base class for custom exceptions | When custom exceptions extend this class and implement their own handling logic |

:::info[Info]
Any error being thrown during the triggering of a processor, its going to be wrapped around a `ProcessorException`.
While exception thrown during the processor runtime, will be the CAUSE of the `ProcessorException` being thrown.
Moreover, `ProcessorException` DOES NOT HAVE a handler for it, it just exists as a layer or a wrap marking the exception thrown to be 
during the runtime of a processor (whether PRE or POST).
:::

## Summary

The `ThrowableHandler` component provides a comprehensive way to handle exceptions in the Imperat framework:

- **SelfHandled exceptions** define their own handling logic via the `handle` method.
- **Non-SelfHandled exceptions** are resolved by registering `ThrowableResolver` instances in the `ThrowableHandler`.

By allowing you to customize exception handling, Imperat ensures smooth command execution and better error management across the board.

:::success Pro Tip
Use `SelfHandledException` for custom, user-specific errors and `ThrowableResolver` for external or generic errors to create a robust and maintainable error-handling strategy.
:::