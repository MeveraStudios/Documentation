---
sidebar_position: 2
---

# Customizing Imperat

Imperat provides extensive customization options through its builder pattern. This guide covers all available configuration methods and their default values.

## Overview

When creating an Imperat instance, you can configure various components using the builder pattern:

```java
BukkitImperat imperat = BukkitImperat.builder(plugin)
    .parameterType(Arena.class, new ArenaParameterType())
    .helpProvider(new CustomHelpProvider())
    .build();
```

## Configuration Options

### Command Processing

#### `commandPrefix(String cmdPrefix)`
Sets the command prefix for the command processing chain.

**Default:** `"/"`

:::warning Minecraft Platform Limitation
This option does **not** work with Minecraft-related platforms (Bukkit, Spigot, Paper, etc.). The prefix will be ignored on these platforms.
:::

```java
BukkitImperat.builder(plugin)
    .commandPrefix("!")  // This will be ignored on Minecraft platforms
    .build();
```

#### `strictCommandTree(boolean strict)`
Sets whether the command tree should be strict. When strict, commands must match exactly.

**Default:** `false`

```java
BukkitImperat.builder(plugin)
    .strictCommandTree(true)
    .build();
```

### Permission System

#### `permissionResolver(PermissionResolver<S> permissionResolver)`
Sets a custom permission resolver for handling permission checks.
Allow  you to define how permissions are checked.

**Default:** `(source, permission) -> true` (allows all permissions)

```java
BukkitImperat.builder(plugin)
    .permissionResolver(new CustomPermissionResolver())
    .build();
```

:::tip
For more details on permission handling, see [Error-Handler](../basics/Error-Handler.md#permission-deniedexception).
:::

### Context System

#### `contextFactory(ContextFactory<S> contextFactory)`
Sets the context factory for creating contexts used in command execution.

**Default:** `ContextFactory.defaultFactory()`

```java
BukkitImperat.builder(plugin)
    .contextFactory(new CustomContextFactory())
    .build();
```

#### `contextResolver(Type type, ContextResolver<S, T> resolver)`
Registers a context resolver for a specific type to provide default values.

```java
BukkitImperat.builder(plugin)
    .contextResolver(Player.class, (source) -> source.as(Player.class))
    .build();
```

#### `contextResolverFactory(Type type, ContextResolverFactory<S, T> factory)`
Registers a context resolver factory for creating resolvers dynamically.

```java
BukkitImperat.builder(plugin)
    .contextResolverFactory(Player.class, new PlayerContextResolverFactory())
    .build();
```

:::tip
For detailed information on context resolvers, see [Context Resolver](Context%20Resolver.md).
:::

### Parameter Types

#### `parameterType(Type type, ParameterType<S, T> resolver)`
Registers a custom parameter type for parsing command arguments.

```java
BukkitImperat.builder(plugin)
    .parameterType(Arena.class, new ArenaParameterType())
    .parameterType(Kit.class, new KitParameterType())
    .build();
```

:::tip
For comprehensive information on parameter types, see [Parameter Types](../basics/Parameter-Type.md).
:::

### Suggestion System

#### `defaultSuggestionResolver(SuggestionResolver<S> resolver)`
Sets the default suggestion resolver for providing autocomplete suggestions.

**Default:** `(context, input) -> Collections.emptyList()` (no suggestions)

```java
BukkitImperat.builder(plugin)
    .defaultSuggestionResolver(new CustomSuggestionResolver())
    .build();
```

#### `namedSuggestionResolver(String name, SuggestionResolver<S> resolver)`
Registers a named suggestion resolver that can be referenced by name.

```java
BukkitImperat.builder(plugin)
    .namedSuggestionResolver("players", new PlayerSuggestionResolver())
    .build();
```

:::tip
For detailed information on suggestion resolvers, see [Suggestion Resolver](../basics/Suggestion%20Resolver.md).
:::

#### `overlapOptionalParameterSuggestions(boolean overlap)`
Controls whether consecutive optional parameter suggestions should overlap with each other.

**Default:** `false`

```java
BukkitImperat.builder(plugin)
    .overlapOptionalParameterSuggestions(true)
    .build();
```

**Behavior:**
- **`false` (default):** Only the corresponding suggestions of the corresponding optional parameter, are suggested at a time, preventing overwhelming users with too many optional choices
- **`true`:** All suggestions of consecutive optional parameters are suggested simultaneously **ONLY IF THEY ARE OF DIFFERENT TYPE**, allowing users to see all possible optional arguments they can provide at the current position

**What it affects:**
- Only optional parameters - required parameters are always suggested regardless of this setting
- Tab completion suggestions 

at the same command depth level

:::note
This setting **only** affects optional parameters. Required parameters are always suggested regardless of this configuration.
:::

### `handleExecutionMiddleOptionalSkipping(boolean handle)`
Controls whether Imperat should handle the skipping of consecutive optional arguments **during execution** with no respect for the order of optional arguments.

**Default:** `false`

```java
BukkitImperat.builder(plugin)
    .handleExecutionMiddleOptionalSkipping(true)
    .build();
```

**Behavior:**
- **`false` (default):** Imperat's `ParameterValueAssigner` respects the order of optional arguments and resolves them in order
- **`true`:** Imperat handles skipping of consecutive optional arguments during execution, assigning values based on type compatibility regardless of order

**Example:**
```java
@Command("test")
public void testCommand(BukkitSource source, @Optional String a, @Optional Integer b) {
    // With handleExecutionMiddleOptionalSkipping = true
    // /test 1 -> a = null, b = 1 (skips 'a', assigns 1 to 'b' because it's Integer type)
    // /test hello 42 -> a = "hello", b = 42
    // /test 42 hello -> a = "hello", b = 42 (reorders based on type)
}
```

**What it affects:**
- Optional parameter resolution during command execution
- Type-based assignment of optional arguments regardless of order

#### `defaultAttachmentMode(AttachmentMode attachmentMode)`
Sets the default attachment mode for all subcommands that don't explicitly specify an attachment mode.

**Default:** `AttachmentMode.MAIN`

```java
BukkitImperat.builder(plugin)
    .defaultAttachmentMode(AttachmentMode.EMPTY)
    .build();
```

**Behavior:**
- **`MAIN` (default):** Subcommands are attached after the parent's main/required parameters
- **`DEFAULT`:** Subcommands are attached after the parent's default parameters
- **`EMPTY`:** Subcommands are attached directly to the parent, ignoring all parent parameters

**Example:**
```java
@Command("admin")
public final class AdminCommand {
    
    @Usage
    public void defaultUsage(BukkitSource source) {
        source.reply("Admin commands: /admin ban <player>, /admin kick <player>");
    }
    
    @SubCommand("ban") // Will use the default attachment mode
    public void banPlayer(BukkitSource source, @Named("player") Player player) {
        // Implementation
    }
}
```

**What it affects:**
- Default attachment behavior for all subcommands
- Global fallback when individual subcommands don't specify attachment mode
- Consistent subcommand behavior across your command system

### Source Resolution

#### `sourceResolver(Type type, SourceResolver<S, R> sourceResolver)`
Registers a source resolver for converting command sources to custom types.

```java
BukkitImperat.builder(plugin)
    .sourceResolver(CustomSource.class, CustomSource::new)
    .build();
```

:::tip
For detailed information on source resolvers, see [Source Resolver](Source%20Resolver.md).
:::

### Processing Chain

#### `preProcessor(CommandPreProcessor<S> preProcessor)`
Adds a pre-processor to the execution chain (runs before argument resolution).

```java
BukkitImperat.builder(plugin)
    .preProcessor(new CustomPreProcessor())
    .build();
```

#### `postProcessor(CommandPostProcessor<S> postProcessor)`
Adds a post-processor to the execution chain (runs after argument resolution).

```java
BukkitImperat.builder(plugin)
    .postProcessor(new CustomPostProcessor())
    .build();
```

:::tip
For detailed information on processors, see [Processors](Processors.md).
:::

#### `preProcessingChain(CommandProcessingChain<S, CommandPreProcessor<S>> chain)`
Sets a custom pre-processing chain, replacing the default chain.

**Default:** Chain with `preUsagePermission()` and `preUsageCooldown()`

```java
BukkitImperat.builder(plugin)
    .preProcessingChain(CommandProcessingChain.<S>preProcessors()
        .then(new CustomPreProcessor())
        .build())
    .build();
```

#### `postProcessingChain(CommandProcessingChain<S, CommandPostProcessor<S>> chain)`
Sets a custom post-processing chain, replacing the default chain.

**Default:** Empty chain

```java
BukkitImperat.builder(plugin)
    .postProcessingChain(CommandProcessingChain.<S>postProcessors()
        .then(new CustomPostProcessor())
        .build())
    .build();
```

### Error Handling

#### `throwableResolver(Class<T> exception, ThrowableResolver<T, S> handler)`
Registers a custom exception handler for specific exception types.

```java
BukkitImperat.builder(plugin)
    .throwableResolver(CustomException.class, (imperat, exception, context) -> {
        // Handle the custom exception
        context.source().reply("Custom error: " + exception.getMessage());
    })
    .build();
```

:::tip
For comprehensive information on error handling, see [Error-Handler](../basics/Error-Handler.md).
:::

### Dependency Injection

#### `dependencyResolver(Type type, DependencySupplier resolver)`
Registers a dependency resolver for providing instances of specific types.

```java
BukkitImperat.builder(plugin)
    .dependencyResolver(PluginManager.class, () -> plugin.getServer().getPluginManager())
    .build();
```

:::tip
For information on using dependency injection in commands, see [Dependency Injection](../basics/Dependency%20Injection.md).
:::

### Custom Annotations

#### `annotationReplacer(Class<A> annotationType, AnnotationReplacer<A> replacer)`
Registers a custom annotation replacer for creating custom annotations.

```java
BukkitImperat.builder(plugin)
    .annotationReplacer(CustomAnnotation.class, new CustomAnnotationReplacer())
    .build();
```

:::tip
For detailed information on creating custom annotations, see [Custom Annotations](Custom%20Annotations.md).
:::

### Help System

#### `helpProvider(HelpProvider<S> helpProvider)`
Sets a custom help provider for generating help messages.

**Default:** No default help provider system

```java
BukkitImperat.builder(plugin)
    .helpProvider(new CustomHelpProvider())
    .build();
```

:::tip
For detailed information on customizing help messages, see [Command Help](Command%20Help.md).
:::

### Usage Verification

#### `usageVerifier(UsageVerifier<S> usageVerifier)`
Sets a custom usage verifier for validating command usages.

**Default:** `UsageVerifier.typeTolerantVerifier()`

```java
BukkitImperat.builder(plugin)
    .usageVerifier(new CustomUsageVerifier())
    .build();
```

### Placeholders

#### `placeholder(Placeholder<S> placeholder)`
Registers a custom placeholder for dynamic content replacement.

```java
BukkitImperat.builder(plugin)
    .placeholder(new CustomPlaceholder())
    .build();
```

### Global Usage Builder

#### `globalDefaultUsageBuilder(CommandUsage.Builder<S> usage)`
Sets a global default usage configuration that applies to all commands registered with this Imperat instance.

**Default:** `CommandUsage.builder()` (empty builder with no defaults)

```java
BukkitImperat.builder(plugin)
    .globalDefaultUsageBuilder(CommandUsage.builder()
        .permission("myplugin.commands")           // All commands require this permission
        .cooldown(Duration.ofSeconds(5))          // All commands have 5-second cooldown
        .description("MyPlugin command")          // Default description for all commands
        .async()                                   // All commands run asynchronously
        .usageFormat("&cUsage: /{command} {args}")) // Custom usage format
    .build();
```

**What it does:**
This allows you to set default properties that will be applied to every command usage unless explicitly overridden. Useful for applying consistent permissions, cooldowns, descriptions, or other settings across your entire command system.

**Example use cases:**
- Setting a global permission prefix for all commands
- Applying consistent cooldowns across your plugin
- Using a custom usage format for all commands
- Setting default async execution for all commands

### Advanced Configuration

#### `applyOnConfig(Consumer<ImperatConfig<S>> configConsumer)`
Applies a consumer function directly to the configuration object for advanced customization.

```java
BukkitImperat.builder(plugin)
    .applyOnConfig(config -> {
        // Direct access to configuration object
        config.setSomeAdvancedOption(true);
    })
    .build();
```

## Complete Example

Here's a comprehensive example showing multiple configuration options:

```java
BukkitImperat imperat = BukkitImperat.builder(plugin)
    // Basic settings
    .strictCommandTree(true)
    
    // Custom parameter types
    .parameterType(Arena.class, new ArenaParameterType())
    .parameterType(Kit.class, new KitParameterType())
    
    // Custom source resolver
    .sourceResolver(CustomSource.class, CustomSource::new)
    
    // Custom suggestion resolver
    .defaultSuggestionResolver(new CustomSuggestionResolver())
    .namedSuggestionResolver("players", new PlayerSuggestionResolver())
    
    // Custom help provider
    .helpProvider(new CustomHelpProvider())
    
    // Custom permission resolver
    .permissionResolver(new CustomPermissionResolver())
    
    // Custom processors
    .preProcessor(new CustomPreProcessor())
    .postProcessor(new CustomPostProcessor())
    
    // Custom exception handler
    .throwableResolver(CustomException.class, (imperat, exception, context) -> {
        context.source().reply("Custom error: " + exception.getMessage());
    })
    
    // Dependency injection
    .dependencyResolver(PluginManager.class, () -> plugin.getServer().getPluginManager())
    
    // Global usage settings
    .globalDefaultUsageBuilder(CommandUsage.builder()
        .permission("myplugin.commands")
        .cooldown(Duration.ofSeconds(5)))
    
    .build();
```

## Default Configuration Summary

| Option | Default Value | Description |
|--------|---------------|-------------|
| `commandPrefix` | `"/"` | Command prefix |
| `strictCommandTree` | `false` | Strict command matching |
| `permissionResolver` | `(source, permission) -> true` | Allow all permissions |
| `contextFactory` | `ContextFactory.defaultFactory()` | Default context factory |
| `defaultSuggestionResolver` | `(context, input) -> Collections.emptyList()` | No suggestions |
| `overlapOptionalParameterSuggestions` | `false` | No overlap in suggestions |
| `handleExecutionMiddleOptionalSkipping` | `false` | Respect order of optional arguments during execution |
| `defaultAttachmentMode` | `AttachmentMode.MAIN` | Default attachment mode for subcommands |
| `usageVerifier` | `UsageVerifier.typeTolerantVerifier()` | Type-tolerant verification |
| `helpProvider` | No default system | No help provider configured |
| `globalDefaultUsage` | `CommandUsage.builder()` | Empty usage builder |
| `preProcessors` | Chain with permission and cooldown | Default pre-processing |
| `postProcessors` | Empty chain | No post-processing |

:::tip Configuration Order
The order of configuration methods doesn't matter - you can call them in any sequence. The builder pattern allows for flexible and readable configuration.
:::

:::info Platform-Specific Options
Some platforms may provide additional configuration options beyond the core Imperat configuration. Check the platform-specific documentation for more details.
::: 