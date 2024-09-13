---
sidebar_position: 4
---
# `ThrowableHandler`

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
        var source = context.getSource();
        source.reply("<red>" + message);
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
imperat.setThrowableResolver( 
    PermissionDeniedException.class,
    (exception, imperat, context) -> context.getSource().error("You don't have permission to use this command!")
);
```

In this example, whenever a `PermissionDeniedException` is thrown, the resolver sends an error message to the source. This allows for a centralized error handling mechanism for all non-SelfHandled exceptions.

:::caution Error Control
It's important to register resolvers for critical exceptions to prevent your command runtime from being interrupted by uncaught errors.
:::

## Summary

The `ThrowableHandler` component provides a comprehensive way to handle exceptions in the Imperat framework:

- **SelfHandled exceptions** define their own handling logic via the `handle` method.
- **Non-SelfHandled exceptions** are resolved by registering `ThrowableResolver` instances in the `ThrowableHandler`.

By allowing you to customize exception handling, Imperat ensures smooth command execution and better error management across the board.

:::success Pro Tip
Use `SelfHandledException` for custom, user-specific errors and `ThrowableResolver` for external or generic errors to create a robust and maintainable error-handling strategy.
:::
