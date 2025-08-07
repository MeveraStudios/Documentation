---
sidebar_position: 8
---
# Suggestions

## What are Suggestions?

**Suggestions** are the helpful hints that appear when players press the **Tab key** while typing a command. Think of them like auto-complete in your code editor - they help users:

- **Discover available options** without having to memorize everything
- **Type commands faster** by completing long names automatically  
- **Avoid mistakes** by showing only valid choices
- **Learn command syntax** by seeing what comes next

**Example**: When a player types `/gamemode ` and presses Tab, they might see suggestions like `survival`, `creative`, `adventure`, `spectator`.

## Types of Suggestions

### Static Suggestions (Fixed)
**Static suggestions** are **pre-defined lists** that never change. They're perfect for:
- **Enum values** (like game modes, difficulty levels)
- **Fixed options** (like command flags, preset names)
- **Constant choices** that don't depend on the game state

**Example**: Game modes are always the same: `survival`, `creative`, `adventure`, `spectator`

### Dynamic Suggestions (Context-Aware)
**Dynamic suggestions** **change based on the current situation**. They're essential for:
- **Player names** (only show online players)
- **World names** (only show loaded worlds)
- **Item names** (only show items the player has)
- **Context-dependent data** (like arena names, team names)

**Example**: For `/teleport <player>`, suggestions show only currently online players, not all players who ever joined.

## What is a Suggestion Resolver?

A **Suggestion Resolver** is a piece of code that **generates the list of suggestions** for a specific parameter. Think of it as a function that answers: *"What should we suggest to the user right now?"*

Every time a player presses Tab, Imperat calls the appropriate Suggestion Resolver to get the most relevant suggestions.

## Creating Suggestion Resolvers

### For Static Suggestions

Use the built-in static methods when your suggestions never change:

```java
// Simple static suggestions
SuggestionResolver<BukkitSource> gameModes = SuggestionResolver.staticSuggestions(
    "survival", "creative", "adventure", "spectator"
);

// From a list
List<String> difficulties = Arrays.asList("peaceful", "easy", "normal", "hard");
SuggestionResolver<BukkitSource> difficultyResolver = SuggestionResolver.staticSuggestions(difficulties);
```

### For Dynamic Suggestions

Create a custom class when your suggestions need to change based on context:

```java
public class OnlinePlayerSuggestionResolver implements SuggestionResolver<BukkitSource> {

    @Override
    public List<String> autoComplete(SuggestionContext<BukkitSource> context, CommandParameter<BukkitSource> parameter) {
        // Get all online players at the moment of tab-completion
        return Bukkit.getOnlinePlayers()
                .stream()
                .map(Player::getName)
                .collect(Collectors.toList());
    }
}
```

### Advanced Context-Aware Example

Here's a more sophisticated example that provides different suggestions based on context:

```java
public class SmartItemSuggestionResolver implements SuggestionResolver<BukkitSource> {
    
    @Override
    public List<String> autoComplete(SuggestionContext<BukkitSource> context, CommandParameter<BukkitSource> parameter) {
        Player player = context.source().as(Player.class);
        
        // Get all available items (Imperat will filter based on user input automatically)
        List<String> suggestions = new ArrayList<>();
        
        // Add common items first
        suggestions.addAll(Arrays.asList(
            "diamond_sword", "diamond_pickaxe", "diamond_axe", "diamond_shovel",
            "iron_sword", "iron_pickaxe", "iron_axe", "iron_shovel",
            "golden_sword", "golden_pickaxe", "golden_axe", "golden_shovel"
        ));
        
        // Add items from player's inventory
        Arrays.stream(player.getInventory().getContents())
                .filter(Objects::nonNull)
                .map(itemStack -> itemStack.getType().name().toLowerCase())
                .forEach(suggestions::add);
        
        return suggestions;
    }
}
```

## Where to Apply Suggestion Resolvers

You can inject your suggestion resolvers in two main places:

### 1. For Specific Parameters

Apply suggestions to individual parameters in your commands.

#### Using Annotations (Recommended)

**For Static Suggestions:**
```java
@Command("difficulty")
public class DifficultyCommand {
    
    @Usage
    public void setDifficulty(
        BukkitSource source,
        @Named("level") @Suggest({"peaceful", "easy", "normal", "hard"}) String difficulty
    ) {
        // Change world difficulty
        source.reply("Difficulty set to " + difficulty);
    }
}
```

**For Dynamic Suggestions:**
```java
@Command("teleport") 
public class TeleportCommand {
    
@Usage  
    public void teleportToPlayer(
  BukkitSource source,
        @Named("target") @SuggestionProvider("online-players") String playerName
    ) {
        Player target = Bukkit.getPlayer(playerName);
        Player player = source.as(Player.class);
        
        player.teleport(target.getLocation());
        source.reply("Teleported to " + target.getName());
    }
}
```

Then register your dynamic suggestion resolver:
```java
BukkitImperat imperat = BukkitImperat.builder(plugin)
    .namedSuggestionResolver("online-players", new OnlinePlayerSuggestionResolver())
    .build();
```

#### Using Classic Command Creation

```java
Command<BukkitSource> giveCommand = Command.<BukkitSource>create("give")
    .usage(CommandUsage.<BukkitSource>builder()
        .parameters(
            CommandParameter.required("player", String.class)
                .suggestionResolver(new OnlinePlayerSuggestionResolver()),
            CommandParameter.required("item", String.class)
                .suggestionResolver(new SmartItemSuggestionResolver())
        )
        .execute((source, context) -> {
            String playerName = context.getArgument("player");
            String itemName = context.getArgument("item");
            // Give item logic here
        })
    )
    .build();
```

### 2. For Parameter Types

Apply suggestions to **all parameters of a specific type** by creating a custom parameter type. This approach is covered in detail in [Parameter Types](Parameter-Type.md#getSuggestionResolver-method).

**Example**: If you have a custom `Arena` class, you can provide suggestions for **every** arena parameter across your entire plugin:

```java
public class ArenaParameterType extends BaseParameterType<BukkitSource, Arena> {
    
    @Override
    public SuggestionResolver<BukkitSource> getSuggestionResolver() {
        return (context, parameter) -> {
            return ArenaManager.getInstance().getAllArenas()
                .stream()
                .map(Arena::getName)
                .collect(Collectors.toList());
        };
    }
    
    // ... other parameter type methods
}
```

For complete details on parameter types and their suggestion capabilities, see [Parameter Types](Parameter-Type.md).

## Real-World Examples

### Music Player Command
```java
@Command("music")
public class MusicCommand {
    
    @Usage
    public void play(
        BukkitSource source,
        @Named("song") @SuggestionProvider("available-songs") String songName,
        @Named("volume") @Suggest({"0.1", "0.5", "1.0", "1.5", "2.0"}) double volume
    ) {
        // Play music logic
        source.reply("Playing " + songName + " at volume " + volume);
    }
}
```

### Economy Command with Smart Suggestions
```java
public class PaySuggestionResolver implements SuggestionResolver<BukkitSource> {
    
    @Override
    public List<String> autoComplete(SuggestionContext<BukkitSource> context, CommandParameter<BukkitSource> parameter) {
        Player player = context.source().as(Player.class);
        double balance = EconomyAPI.getBalance(player);
        
        // Suggest common amounts and player's current balance
        return Arrays.asList(
            "10", "50", "100", "500", "1000",
            String.valueOf((int) balance),      // Full balance
            String.valueOf((int) balance / 2),  // Half balance
            String.valueOf((int) balance / 4)   // Quarter balance
        );
    }
}
```

## Suggestion Priority System

When a player presses Tab, Imperat follows this **priority order**:

1. **Parameter-specific resolver** (highest priority)
   - Resolvers assigned directly to individual parameters using `@SuggestionProvider` or `.suggestionResolver()`

2. **Parameter type resolver** (fallback)
   - Resolvers defined in custom `ParameterType` classes via `getSuggestionResolver()`

3. **Default behavior** (last resort)
   - Built-in suggestions for standard types (Player names, World names, etc.)

## Best Practices

### 1. Provide All Relevant Options
Return all possible suggestions - Imperat will automatically filter them based on user input:

```java
@Override
public List<String> autoComplete(SuggestionContext<BukkitSource> context, CommandParameter<BukkitSource> parameter) {
    // Return all possible values - Imperat handles filtering automatically
    return getAllPossibleValues();
}
```

### 2. Limit Suggestion Count
Don't overwhelm users with too many suggestions:

```java
return suggestions.stream()
    .limit(10) // Show max 10 suggestions
    .collect(Collectors.toList());
```

### 3. Sort Suggestions Logically
Present suggestions in a logical order:

```java
return suggestions.stream()
    .sorted() // Alphabetical order
    .collect(Collectors.toList());

// Or custom sorting (by importance/frequency):
return suggestions.stream()
    .sorted((a, b) -> {
        // Put most common options first
        if (isCommonOption(a) && !isCommonOption(b)) return -1;
        if (!isCommonOption(a) && isCommonOption(b)) return 1;
        return a.compareToIgnoreCase(b);
    })
    .collect(Collectors.toList());
```

### 4. Handle Edge Cases
Always handle cases where no suggestions are available:

```java
@Override
public List<String> autoComplete(SuggestionContext<BukkitSource> context, CommandParameter<BukkitSource> parameter) {
    List<String> suggestions = generateSuggestions(context);
    
    // Return empty list instead of null
    return suggestions != null ? suggestions : Collections.emptyList();
}
```

## Summary

Suggestions make your commands user-friendly and professional. Remember:

- **Static suggestions** for fixed choices (game modes, difficulties)
- **Dynamic suggestions** for context-dependent data (online players, loaded worlds)
- **Parameter-specific** resolvers for individual command parameters
- **Type-wide** resolvers for consistent behavior across all parameters of the same type
- **Filter and limit** suggestions to keep them relevant and manageable

With well-designed suggestions, your users will find your commands intuitive and easy to use, leading to a better overall experience with your plugin!