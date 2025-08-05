---
title: Error Handler
sidebar_position: 9
---
# Error Handler
~
The `ThrowableHandler` is a core component in the Imperat framework, designed to manage exceptions that occur during command execution.
It handles two types of exceptions:

1. **SelfHandled** exceptions
2. **Non-SelfHandled** exceptions

Each type has its own mechanism for resolution, offering flexibility for both user-defined and external exceptions.

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
        source.reply("&e" + message); //message colored in yellow on bukkit platform
    }
}
```

In the example above, the custom exception `ExampleCustomException` displays a message in red when thrown. The `handle` method allows developers to define how the exception should be processed and communicated to the source.

:::info Usage Tip
When defining custom exceptions, you can extend `SelfHandledException` and override the `handle` method to dictate exactly how the exception is resolved within the framework's runtime.
:::

## Non-SelfHandled Exceptions

For exceptions that **do not** extend `SelfHandledException`, the Imperat framework uses the `ThrowableHandler` to resolve them. These can be any standard Java exceptions or other custom ones that the user chooses not to self-handle.

The `ThrowableHandler` associates exception types with `ThrowableResolver`—a functional interface that provides a resolution strategy for the exception.

### Registering Non-SelfHandled Exceptions

To register a `ThrowableResolver` for a non-SelfHandled exception, use the `setThrowableResolver` method like this:

```java
imperat = BukkitImperat.builder(plugin)
    .throwableResolver(
        PermissionDeniedException.class,
        (exception, imperat, context) -> context.source().error("You don't have permission to use this command!")
    )
    .build();
```

In this example, whenever a `PermissionDeniedException` is thrown, the resolver sends an error message to the source. This allows for a centralized error handling mechanism for all non-SelfHandled exceptions.

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

## Summary

The `ThrowableHandler` component provides a comprehensive way to handle exceptions in the Imperat framework:

- **SelfHandled exceptions** define their own handling logic via the `handle` method.
- **Non-SelfHandled exceptions** are resolved by registering `ThrowableResolver` instances in the `ThrowableHandler`.

By allowing you to customize exception handling, Imperat ensures smooth command execution and better error management across the board.

:::success Pro Tip
Use `SelfHandledException` for custom, user-specific errors and `ThrowableResolver` for external or generic errors to create a robust and maintainable error-handling strategy.
:::