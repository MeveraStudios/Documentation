---
sidebar_position: 8
---

# Custom Annotations

Imperat's **Custom Annotations** feature allows you to create your own annotations that automatically generate multiple built-in annotations during command parsing. This powerful feature helps you reduce code duplication and create more expressive, domain-specific command structures.

:::info What are Custom Annotations?
Custom annotations are your own annotation types that, when applied to command classes, automatically generate multiple built-in Imperat annotations. Think of them as "annotation shortcuts" that combine common patterns into a single, meaningful annotation.
:::

## How It Works

When you use a custom annotation on a command class, Imperat's parser:

1. **Detects** your custom annotation
2. **Finds** the registered `AnnotationReplacer` for that annotation type
3. **Executes** the replacer to generate built-in annotations dynamically
4. **Applies** those generated annotations as if you had written them manually

This happens automatically during command registration, so there's no performance impact at runtime.

## Creating Custom Annotations

### Step 1: Define Your Custom Annotation

First, create your custom annotation with the appropriate retention and target policies:

```java
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)  // Available at runtime for reflection
@Target(ElementType.TYPE)            // Can be used on classes
public @interface AdminCommand {
    String value() default "";        // Optional: command name
    String permission() default "admin"; // Optional: permission prefix
}
```

### Step 2: Create an AnnotationReplacer

Create a function that converts your custom annotation into built-in Imperat annotations:

```java
import dev.velix.imperat.command.annotations.*;
import dev.velix.imperat.command.AnnotationFactory;
import java.util.List;

// Define what your custom annotation should generate
AnnotationReplacer<AdminCommand> adminCommandReplacer = (annotation) -> {
    String commandName = annotation.value().isEmpty() ? "admin" : annotation.value();
    String permission = annotation.permission() + "." + commandName;
    
    // Generate built-in annotations
    var cmd = AnnotationFactory.create(Command.class, "value", new String[]{commandName});
    var perm = AnnotationFactory.create(Permission.class, "value", permission);
    var desc = AnnotationFactory.create(Description.class, "value", "Admin command: " + commandName);
    
    return List.of(cmd, perm, desc);
};
```

### Step 3: Register the AnnotationReplacer

Register your replacer with the Imperat instance:

```java
Imperat<BukkitSource> imperat = BukkitImperat.builder(plugin)
    .annotationReplacer(AdminCommand.class, adminCommandReplacer)
    .build();
```

### Step 4: Use Your Custom Annotation

Now you can use your custom annotation on command classes:

```java
@AdminCommand("ban")
// This class automatically gets:
// @Command("ban")
// @Permission("admin.ban") 
// @Description("Admin command: ban")
public final class BanCommand {
    
    @Usage
    public void banPlayer(BukkitSource source, @Named("player") Player player) {

        source.reply("Banning " + player.getName());
    }
}
```

## Real-World Examples

### Example 1: Moderation Commands

Create a custom annotation for moderation commands that automatically adds permissions and descriptions:

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface ModCommand {
    String action();  // "ban", "kick", "mute", etc.
    String description() default "";
}

// Registration
AnnotationReplacer<ModCommand> modCommandReplacer = (annotation) -> {
    String action = annotation.action();
    String desc = annotation.description().isEmpty() 
        ? "Moderate players with " + action 
        : annotation.description();
    
    return List.of(
        AnnotationFactory.create(Command.class, "value", new String[]{action}),
        AnnotationFactory.create(Permission.class, "value", "moderation." + action),
        AnnotationFactory.create(Description.class, "value", desc)
    );
};

// Usage
@ModCommand(action = "ban", description = "Ban players from the server")
// Automatically gets as if you had placed
//@Command("ban"), @Permission("moderation.ban"), etc.

public final class BanCommand {
}
```

### Example 2: Game Commands

Create a custom annotation for game-related commands:

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface GameCommand {
    String game();  // "skywars", "bedwars", "duels", etc.
    boolean requiresGame() default true;
}

// Registration
AnnotationReplacer<GameCommand> gameCommandReplacer = (annotation) -> {
    String game = annotation.game();
    List<Object> annotations = new ArrayList<>();
    
    annotations.add(AnnotationFactory.create(Command.class, "value", new String[]{game}));
    annotations.add(AnnotationFactory.create(Description.class, "value", game + " game command"));
    
    if (annotation.requiresGame()) {
        annotations.add(AnnotationFactory.create(Permission.class, "value", "game." + game));
    }
    
    return annotations;
};

// Usage
@GameCommand(game = "skywars")
public final class SkywarsCommand {
    // Automatically gets game-specific permissions and descriptions
}
```

### Example 3: Configuration Commands

Create a custom annotation for configuration management commands:

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface ConfigCommand {
    String config();  // "server", "player", "world", etc.
}

// Registration
AnnotationReplacer<ConfigCommand> configCommandReplacer = (annotation) -> {
    String config = annotation.config();
    
    return List.of(
        AnnotationFactory.create(Command.class, "value", new String[]{config + "config"}),
        AnnotationFactory.create(Permission.class, "value", "config." + config),
        AnnotationFactory.create(Description.class, "value", "Manage " + config + " configuration")
    );
};

// Usage
@ConfigCommand("server")
public final class ServerConfigCommand {
    // Automatically gets @Command("serverconfig"), @Permission("config.server"), etc.
}
```

## Advanced Features

### Using Annotation Attributes

You can access your custom annotation's attributes in the replacer:

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface CustomCommand {
    String name();
    String[] aliases() default {};
    String permission() default "";
    boolean async() default false;
}

AnnotationReplacer<CustomCommand> replacer = (annotation) -> {
    List<Object> annotations = new ArrayList<>();
    
    // Use the annotation's attributes
    String[] names = new String[annotation.aliases().length + 1];
    names[0] = annotation.name();
    System.arraycopy(annotation.aliases(), 0, names, 1, annotation.aliases().length);
    
    annotations.add(AnnotationFactory.create(Command.class, "value", names));
    
    if (!annotation.permission().isEmpty()) {
        annotations.add(AnnotationFactory.create(Permission.class, "value", annotation.permission()));
    }
    
    if (annotation.async()) {
        // Note: @Async is a method-level annotation, so this would need special handling
        // You might want to create a custom processor instead
    }
    
    return annotations;
};
```

### Conditional Annotation Generation

You can generate different annotations based on conditions:

```java
AnnotationReplacer<MyCommand> conditionalReplacer = (annotation) -> {
    List<Object> annotations = new ArrayList<>();
    
    // Always add command annotation
    annotations.add(AnnotationFactory.create(Command.class, "value", new String[]{"mycommand"}));
    
    // Conditionally add permission based on environment
    if (System.getProperty("production").equals("true")) {
        annotations.add(AnnotationFactory.create(Permission.class, "value", "production.mycommand"));
    } else {
        annotations.add(AnnotationFactory.create(Permission.class, "value", "dev.mycommand"));
    }
    
    return annotations;
};
```

## Best Practices

### 1. **Keep It Simple**
Don't overcomplicate your custom annotations. They should represent clear, reusable patterns.

```java
// Good: Simple and clear
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface PlayerCommand {
    String permission() default "player";
}

// Avoid: Too complex
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface ComplexCommand {
    String name();
    String[] aliases();
    String permission();
    String description();
    boolean async();
    boolean cooldown();
    long cooldownTime();
    // ... too many options
}
```

### 2. **Use Meaningful Names**
Choose annotation names that clearly indicate their purpose:

```java
// Good names
@AdminCommand
@PlayerCommand
@ModCommand
@GameCommand

// Avoid generic names
@MyCommand
@CustomCommand
@SpecialCommand
```

### 3. **Provide Sensible Defaults**
Make your annotations easy to use by providing good default values:

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface SimpleCommand {
    String value();  // Required: command name
    String permission() default "";  // Optional: auto-generated if empty
    String description() default ""; // Optional: auto-generated if empty
}
```

### 4. **Document Your Annotations**
Add clear documentation to your custom annotations:

```java
/**
 * Marks a command as an admin command with automatic permission generation.
 * 
 * @param value The command name (e.g., "ban", "kick")
 * @param permission The permission prefix (defaults to "admin")
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface AdminCommand {
    String value();
    String permission() default "admin";
}
```

## Common Patterns

### Permission-Based Commands
```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface PermissionCommand {
    String permission();
    String description() default "";
}
```

### Game-Specific Commands
```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface GameCommand {
    String game();
    boolean requiresGame() default true;
}
```

### Configuration Commands
```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface ConfigCommand {
    String config();
    String permission() default "";
}
```

## Troubleshooting

### Common Issues

1. **Annotation Not Working**: Make sure you registered the `AnnotationReplacer` before registering commands
2. **Wrong Annotation Type**: Ensure your replacer returns the correct annotation types
3. **Missing Imports**: Import all required annotation classes in your replacer

### Debugging Tips

```java
// Add logging to see what annotations are being generated
AnnotationReplacer<MyCommand> debugReplacer = (annotation) -> {
    List<Object> generated = generateAnnotations(annotation);
    System.out.println("Generated annotations: " + generated);
    return generated;
};
```

:::tip Pro Tip
Custom annotations are perfect for creating domain-specific command patterns. Use them to enforce consistent permissions, descriptions, and command structures across your plugin.
:::

:::success Success Story
Custom annotations can reduce boilerplate code by up to 80% for commands with similar patterns, making your codebase more maintainable and consistent.
::: 