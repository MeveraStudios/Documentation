---
sidebar_position: 5
---
# Parameter Type

## What is a Parameter Type?

A **Parameter Type** is like a translator that converts the text input from a user into a specific object type that your command can use. Think of it as a bridge between what the user types and what your code needs.

**Simple Example:** When a user types `/give diamond 64`, Imperat needs to convert:
- `"diamond"` → `Material.DIAMOND` object
- `"64"` → `64` (integer)

## Why Do You Need Custom Parameter Types?

Imperat comes with built-in support for common types like `String`, `int`, `Player`, etc. But when you want to use your own custom classes as command parameters, you need to tell Imperat how to convert the user's text input into your custom object.

## Real-World Example: Arena System

Let's say you're building a minigame plugin with an arena system. You have an `Arena` class that represents a game arena:

```java
public class Arena {
    private final String name;
    private final int maxPlayers;
    private final String worldName;
    
    public Arena(String name, int maxPlayers, String worldName) {
        this.name = name;
        this.maxPlayers = maxPlayers;
        this.worldName = worldName;
    }
    
    public String getName() { return name; }
    public int getMaxPlayers() { return maxPlayers; }
    public String getWorldName() { return worldName; }
}
```

Now you want to create a command like `/arena join <arena>` where users can join a specific arena by typing its name.

## Step 1: Create the Parameter Type

You need to create a class that tells Imperat how to convert the arena name (text) into an `Arena` object:

```java
public final class ArenaParameterType extends BaseParameterType<PlatformSource, Arena> {
    
    public ArenaParameterType() {
        super(TypeWrap.of(Arena.class));
    }

    @Override
    public @Nullable Arena resolve(
        ExecutionContext<PlatformSource> context,
        @NotNull CommandInputStream<PlatformSource> commandInputStream,
        String input
    ) throws ImperatException {
        // This is where the magic happens!
        // Convert the user's input (arena name) into an Arena object
        
        // Try to find the arena by name
        Arena arena = ArenaManager.getInstance().getArena(input);
        
        if (arena == null) {
            // If arena doesn't exist, throw an error
            throw new SourceException("Arena '" + input + "' not found!");
        }
        
        return arena;
    }

    @Override
    public SuggestionResolver<PlatformSource> getSuggestionResolver() {
        // This provides tab-completion suggestions
        return (context, input) -> {
            return ArenaManager.getInstance().getAllArenas()
                .stream()
                .map(Arena::getName)
                .filter(name -> name.toLowerCase().startsWith(input.toLowerCase()))
                .collect(Collectors.toList());
        };
    }
}
```

## Step 2: Register Your Parameter Type

Tell Imperat about your custom parameter type by registering it when building your Imperat instance:

```java
BukkitImperat imperat = BukkitImperat.builder(plugin)
    .parameterType(Arena.class, new ArenaParameterType())
    .build();
```

For more details on registering parameter types, see [Customizing Imperat](../advanced/Customizing%20Imperat.md#parameter-types).

## Step 3: Use It in Your Commands

Now you can use `Arena` as a parameter type in your commands!

### Annotations Example (Recommended):

```java
@Command("arena")
public final class ArenaCommand {
    
    @Usage
    public void defaultUsage(BukkitSource source) {
        source.reply("Usage: /arena join <arena>");
    }
    
    @Usage
    public void joinArena(
        BukkitSource source,
        @Named("arena") Arena arena
    ) {
        // Imperat automatically converts the user's input to an Arena object!
        Player player = source.as(Player.class);
        
        if (arena.getMaxPlayers() <= arena.getCurrentPlayers()) {
            source.reply("Arena '" + arena.getName() + "' is full!");
            return;
        }
        
        arena.addPlayer(player);
        source.reply("Joined arena '" + arena.getName() + "'!");
    }
}
```

### Classic Example:

```java
Command<BukkitSource> arenaCommand = Command.<BukkitSource>create("arena")
    .defaultExecution((source, context) -> {
        source.reply("Usage: /arena join <arena>");
    })
    .usage(CommandUsage.<BukkitSource>builder()
        .parameters(CommandParameter.required("arena", new ArenaParameterType()))
        .execute((source, context) -> {
            Arena arena = context.getArgument("arena");
            Player player = source.as(Player.class);
            
            if (arena.getMaxPlayers() <= arena.getCurrentPlayers()) {
                source.reply("Arena '" + arena.getName() + "' is full!");
                return;
            }
            
            arena.addPlayer(player);
            source.reply("Joined arena '" + arena.getName() + "'!");
        })
    )
    .build();
```

## How It Works

1. **User types:** `/arena join survival`
2. **Imperat sees:** `"survival"` (String)
3. **Your ParameterType converts:** `"survival"` → `Arena` object
4. **Your command receives:** A fully usable `Arena` object with all its methods and properties

## Error Handling

If the user types an invalid arena name, your `ParameterType` throws an exception:

```java
throw new SourceException("Arena '" + input + "' not found!");
```

Imperat automatically catches this and shows the user a friendly error message: `"Arena 'invalid_arena' not found!"`

For more details on error handling, see [Error Handler](Error-Handler.md).

## Supported Parameter Types

Imperat comes with comprehensive built-in support for a wide variety of parameter types. These types are automatically resolved without requiring custom parameter types.

:::warning[Primitive Types Warning]
**⚠️ Important:** If the argument is optional without a default-value set for it, and is a primitive, this will cause a null pointer exception that cannot be fixed without changing the primitive type to a boxed type. 

**Example:** `int` → `Integer`

**Why this happens:** Primitives cannot be `null`, so when an optional argument is not provided, Imperat tries to pass `null`, which causes a `NullPointerException`.

**Solution:** Always use boxed types for optional parameters without default values.
:::

### Primitive Types

| Type | Description | Example Input | Notes |
|------|-------------|---------------|-------|
| `String` | Text string | `"hello world"` | Default type, no conversion needed |
| `int` | 32-bit integer | `42` | Supports negative numbers |
| `long` | 64-bit integer | `1234567890L` | Supports L suffix |
| `double` | 64-bit floating point | `3.14159` | Supports scientific notation |
| `float` | 32-bit floating point | `2.5f` | Supports f suffix |
| `boolean` | True/false value | `true`, `false` | Case-insensitive |
| `char` | Single character | `'a'` | Supports single quotes |
| `byte` | 8-bit integer | `127` | Range: -128 to 127 |
| `short` | 16-bit integer | `32767` | Range: -32768 to 32767 |

### Java Wrapper Types

| Type | Description |
|------|-------------|
| `Integer` | Wrapper for int |
| `Long` | Wrapper for long |
| `Double` | Wrapper for double |
| `Float` | Wrapper for float |
| `Boolean` | Wrapper for boolean |
| `Character` | Wrapper for char |
| `Byte` | Wrapper for byte |
| `Short` | Wrapper for short |

### Java Standard Library Types

| Type | Description | 
|------|-------------|
| `UUID` | Universally unique identifier |

### Enum Types

**All enum types are automatically supported** - both built-in Java enums and custom enums:

**Popular Bukkit Examples:** `GameMode`, `Material`, `Enchantment`, `WeatherType`, `Difficulty`, `Particle`, `Sound`, `PotionEffectType`, `EntityType`, `Biome`, `BlockFace`, `Axis`, `DyeColor`, `TreeType`, `Instrument`

```java
// Built-in Java enum
public enum DayOfWeek {
    MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY
}

// Custom enum
public enum GameMode {
    SURVIVAL, CREATIVE, ADVENTURE, SPECTATOR
}

// Usage in command
public void setGameMode(BukkitSource source, @Named("mode") GameMode mode) {
    // mode will be resolved from input like "survival", "SURVIVAL", "Survival"
    // Case-insensitive matching
}
```

### Array Types

**Generic Format:** `T[]` where `T` is any supported parameter type

**Working Examples:**
- `String[]` - Array of strings
- `int[]` - Array of integers  
- `Player[]` - Array of players
- `GameMode[]` - Array of enums

**What "T is registered" means:** The type `T` must have a corresponding `ParameterType` implementation registered in Imperat's `ParamTypeRegistry`. This includes all built-in types (primitives, wrappers, platform types) and any custom parameter types you've registered.

### Collection Types

**All Java Collection types are supported** where the element type `T` has a supported parameter type registered in Imperat:

**Generic Format:** `? extends Collection<T>` where `T` is any supported parameter type

#### List Implementations
| Type | Description |
|------|-------------|
| `ArrayList<T>` | ArrayList of type T |
| `LinkedList<T>` | LinkedList of type T |
| `Vector<T>` | Vector of type T (thread-safe) |
| `Stack<T>` | Stack of type T (LIFO collection) |
| `CopyOnWriteArrayList<T>` | Thread-safe ArrayList |

#### Set Implementations
| Type | Description |
|------|-------------|
| `HashSet<T>` | HashSet of type T |
| `LinkedHashSet<T>` | LinkedHashSet of type T |
| `TreeSet<T>` | TreeSet of type T |
| `CopyOnWriteArraySet<T>` | Thread-safe Set |
| `ConcurrentSkipListSet<T>` | Thread-safe sorted Set |

#### Queue/Deque Implementations
| Type | Description |
|------|-------------|
| `ArrayDeque<T>` | Array-based deque |
| `PriorityQueue<T>` | Priority queue |
| `ConcurrentLinkedQueue<T>` | Thread-safe linked queue |
| `ConcurrentLinkedDeque<T>` | Thread-safe linked deque |
| `LinkedBlockingQueue<T>` | Thread-safe blocking queue |
| `PriorityBlockingQueue<T>` | Thread-safe priority blocking queue |
| `DelayQueue<T>` | Delay-based queue |
| `SynchronousQueue<T>` | Synchronous queue |
| `LinkedTransferQueue<T>` | Transfer queue |

### Map Types

**All Java Map types are supported** where both key and value types have supported parameter types:

| Type | Description |
|------|-------------|
| `HashMap<K, V>` | HashMap implementation |
| `TreeMap<K, V>` | TreeMap implementation (sorted) |
| `LinkedHashMap<K, V>` | LinkedHashMap implementation (insertion order) |
| `ConcurrentHashMap<K, V>` | Thread-safe HashMap |
| `WeakHashMap<K, V>` | WeakHashMap implementation |
| `ConcurrentSkipListMap<K, V>` | Thread-safe sorted map |
| `IdentityHashMap<K, V>` | Identity-based HashMap |

:::warning[EnumMap Not Supported]
**⚠️ Note:** `EnumMap` is not currently supported in Imperat. Use `HashMap<EnumType, ValueType>` instead.
:::

:::tip[Default Implementations]
**💡 When using collection interfaces, Imperat automatically uses some default implementations:**

- **`List<T>`** → Uses `ArrayList<T>` as Implementation
- **`Set<T>`** → Uses `HashSet<T>` as Implementation  
- **`Queue<T>`** → Uses `LinkedList<T>` as Implementation
- **`Deque<T>`** → Uses `ArrayDeque<T>` as Implementation
- **`Map<K, V>`** → Uses `HashMap<K, V>` as Implementation
- **`SortedMap<K,V>`** → Uses `TreeMap<K, V>` as Implementation

This ensures consistent behavior when you specify just the interface type.
:::

### Optional Types

**Java Optional types are supported** for nullable parameters;
If a parameter-type of type `T` has a registered parameter-type class in Imperat's registry where the value of this parameter can be null in the method 
`YourParameterType#resolve`, you can set a parameter in a method of type `Optional<T>` where `T` has a parameter type (`YourParameterType`) that can return a value that can be null (nullable).

Working Examples: 

| Type | Description |
|------|-------------|
| `Optional<String>` | Optional string |
| `Optional<Integer>` | Optional integer |
| `Optional<Player>` | Optional player |

:::warning[Type Registration Required]
**⚠️ Important:** The type `T` in `Optional<T>` **MUST** have a registered parameter type in Imperat's registry.

**What this means:** Before you can use `Optional<MyCustomType>`, you must first register a `ParameterType` for `MyCustomType` using `imperat.parameterType(MyCustomType.class, new MyCustomParameterType())`.

**Example:**
```java
// ❌ This will FAIL - Player type not registered
@Usage
public void badExample(BukkitSource source, @Named("player") Optional<Player> player) {
    // This won't work if Player parameter type isn't registered
}

// ✅ This will WORK - String type is built-in
@Usage  
public void goodExample(BukkitSource source, @Named("message") Optional<String> message) {
    // This works because String is a built-in parameter type
}
```

**Built-in types** (String, Integer, Double, etc.) are automatically registered, so `Optional<String>` works out of the box.
If you want to have `Optional<Player>` in this example, then just register
a parameter-type for type `Player` and it should work flawlessly.
:::

### CompletableFuture Types

**CompletableFuture types are supported** for asynchronous parameter resolution:

| Type | Description |
|------|-------------|
| `CompletableFuture<String>` | Async string |
| `CompletableFuture<Integer>` | Async integer |
| `CompletableFuture<Player>` | Async player |

:::warning[Type Registration Required]
**⚠️ Important:** The type `T` in `CompletableFuture<T>` **MUST** have a registered parameter type in Imperat's registry.

**What this means:** Before you can use `CompletableFuture<MyCustomType>`, you must first register a `ParameterType` for `MyCustomType` using `imperat.parameterType(MyCustomType.class, new MyCustomParameterType())`.

**Example:**
```java
// ❌ This will FAIL - Player type not registered
@Usage
public void badExample(BukkitSource source, @Named("player") CompletableFuture<Player> player) {
    // This won't work if Player parameter type isn't registered
}

// ✅ This will WORK - String type is built-in
@Usage  
public void goodExample(BukkitSource source, @Named("message") CompletableFuture<String> message) {
    // This works because String is a built-in parameter type
}
```

**Built-in types** (String, Integer, Double, etc.) are automatically registered, so `CompletableFuture<String>` works out of the box.
If you want to have `CompletableFuture<Player>` in this example, then just register
a parameter-type for type `Player` and it should work flawlessly.
:::

### Platform-Specific Types

#### Bukkit/Spigot

| Type | Description |
|------|-------------|
| `Player` | Online player |
| `OfflinePlayer` | Any player (online/offline) |
| `World` | World instance |
| `Location` | 3D location with world |
All `Enum` in Bukkit is supported, e.g: `Material`, `Sound`, `Enchantment`, `EntityType`, `PotionEffectType`, `BlockFace`, `GameMode`, `Biome`, etc. |
| `Note` | Musical note |

#### BungeeCord

| Type | Description |
|------|-------------|
| `ProxiedPlayer` | Connected player |
| `ServerInfo` | Server information |

#### Velocity

| Type | Description |
|------|-------------|
| `Player` | Connected player |

#### Minestom

| Type | Description |
|------|-------------|
| `Player` | Connected player |
| `Instance` | World instance |
| `Block` | Block type |
| `ItemStack` | Item stack |

### Generic Type Support

Imperat supports **all generic types** where the type parameters have supported parameter types:

```java
// Generic collections
List<Player> players
Set<GameMode> gameModes
Map<String, Integer> scores

// Generic arrays
Player[] players
GameMode[] modes

// Nested generics
Map<String, List<Player>> teams
List<Map<String, Integer>> scoreboards

// Optional with generics
Optional<Player> player
Optional<List<String>> messages

// CompletableFuture with generics
CompletableFuture<Player> asyncPlayer
CompletableFuture<List<String>> asyncMessages
```

### Type Conversion Features

Imperat's built-in parameter types support:

- **Case-insensitive parsing** for enums and string-based types
- **Automatic number parsing** with locale support
- **Collection parsing** from comma-separated strings
- **Map parsing** from key-value pairs
- **UUID parsing** from various formats
- **Location parsing** with coordinate validation
- **Player name resolution** with online/offline support
- **Async resolution** for CompletableFuture types
- **Nullable handling** for Optional types

### Error Handling

When parameter parsing fails, Imperat provides clear error messages:

- **Invalid number format**: "Expected a number, got 'abc'"
- **Player not found**: "Player 'InvalidPlayer' not found"
- **Invalid enum value**: "Invalid value 'INVALID' for GameMode"
- **Out of range**: "Value 150 is out of range (1-100)"
- **Invalid collection format**: "Invalid collection format: expected 'item1,item2'"
- **Invalid map format**: "Invalid map format: expected 'key1:value1,key2:value2'"

### Performance Considerations

- Built-in types are highly optimized for performance
- Custom parameter types should implement efficient parsing
- Consider caching frequently used values in custom types
- Use appropriate exception types for different error scenarios
- Async types (CompletableFuture) provide non-blocking resolution
- Optional types help with null safety without performance overhead

### Custom Types

For any type not listed above, you'll need to create a custom `ParameterType` implementation as shown in the examples above. Imperat's extensible architecture makes it easy to add support for any custom type you need.