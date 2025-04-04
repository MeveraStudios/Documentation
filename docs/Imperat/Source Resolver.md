---
sidebar_position: 10
---
# Source Resolver

In **Imperat**, `SourceResolver<S extends Source, R>` is an interface designed to handle the resolution of platform-specific command sources (`S`) into custom types (`R`). This allows for the flexibility of customizing the command source based on the platform, enabling developers to transform platform-specific command senders into their own command source representations.

## Source Interface

`Source` is an interface representing the command sender on a given platform. Since Imperat is designed to work across multiple platforms, the type of `S` depends on the platform you're working with. For example, in a Bukkit environment, `BukkitSource` would implement the `Source` interface, representing the sender of a command in Bukkit.

The purpose of the `SourceResolver` is to map a command sender (such as `BukkitSource`) into a custom type (`R`) that better fits the needs of your project.

## Interface Definition

The `SourceResolver` interface is simple in its design:

```java
public interface SourceResolver<S extends Source, R> {
    R resolve(S source) throws ImperatException;
}
```

- `S`: The platform-specific source, e.g., `BukkitSource` in Bukkit.
- `R`: The resolved type, representing your custom command source.
- `resolve(S source)`: This method transforms a platform-specific source into a custom type `R`. It can throw an `ImperatException` to signal any issues during the resolution process.

## Example of Custom Source

Here's an example of a custom class representing a player on a given platform:

```java
public final class CustomPlayer {
    private final CommandSender sender;

    public CustomPlayer(CommandSender sender) {
        this.sender = sender;
    }

    public void sendMessage(String msg) {
        sender.sendMessage(msg);
    }
    
    public void greet() {
        sendMessage("Greetings " + sender.getName());
    }
    
    // Additional methods to access player-specific data
}
```

## Example: Implementing a SourceResolver

Below is an example of how to create a `SourceResolver` for Bukkit's `BukkitSource`, which transforms it into a custom `CustomPlayer` type:

```java
public class CustomSourceResolver implements SourceResolver<BukkitSource, CustomPlayer> {
    
    @Override
    public @NotNull CustomPlayer resolve(BukkitSource source) throws ImperatException {
        if (source.isConsole()) {
            throw new SourceException("Only players are allowed to execute this command");
        }
        return new CustomPlayer(source.origin());
    }
    
}
```

In this example:
- The `resolve` method checks if the source is a console (and disallows it) and otherwise returns a `CustomPlayer` instance, wrapping the original `CommandSender`.

## Registering a `SourceResolver`

Once your `SourceResolver` is implemented, you can register it with Imperat as follows:

```java
imperat = BukkitImperat.builder(plugin)
    .sourceResolver(CustomPlayer.class, new CustomSourceResolver())
    .build();
```

This allows Imperat to resolve `BukkitSource` into your `CustomPlayer` type whenever necessary.

## Example Usage

This can be used differently depending on the way your making your commands (whether Classic or Annotations)

### Classic example
```java
imperat.registerCommand(
    Command.<BukkitSource>create("test")
    .usage(
        CommandUsage.<BukkitSource>builder()
        .parameters(CommandParameter.requiredText("txt"))
        .execute((source, ctx)-> {
            CustomPlayer customPlayer = ctx.getResolvedSource(CustomPlayer.class);
            String txt = ctx.getArgument("txt");
            //do whatever you want with custom player
            customPlayer.greet();
            customPlayer.sendMessage("The text you entered is '" + txt + "'");
        })
    ).build()
);
```

### Annotations example
```java
public final class TestCommand {
    @Usage
    public void someUsage(CustomPlayer player, @Named("txt") String txt) {
        player.greet();
        player.sendMessage("The text you entered is '" + txt + "'");
    }
}
```