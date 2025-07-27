---
sidebar_position: 10
---

# Dependency Injection

Imperat provides a powerful dependency injection system that allows you to inject services, managers, and other dependencies directly into your command classes. This feature makes your commands cleaner and more maintainable by separating business logic from command handling.

## Overview

The `@Dependency` annotation allows you to inject dependencies into your command classes. These dependencies are resolved at runtime and can be any object that you register with the Imperat instance.

## Basic Usage

### 1. Register Dependencies

First, register your dependencies with the Imperat instance using the `dependencyResolver` method:

```java
public class MyPlugin extends JavaPlugin {
    
    private BukkitImperat imperat;
    private PlayerManager playerManager;
    private EconomyService economyService;
    
    @Override
    public void onEnable() {
        // Initialize your services
        playerManager = new PlayerManager();
        economyService = new EconomyService();
        
        // Register dependencies with Imperat
        imperat = BukkitImperat.builder(this)
            .dependencyResolver(PlayerManager.class, () -> playerManager)
            .dependencyResolver(EconomyService.class, () -> economyService)
            .build();
    }
}
```

### 2. Inject Dependencies in Commands

Use the `@Dependency` annotation on fields in your command classes:

```java
@Command("balance")
@Permission("economy.balance")
public final class BalanceCommand {
    
    @Dependency
    private PlayerManager playerManager;
    
    @Dependency
    private EconomyService economyService;
    
    @Usage
    public void checkBalance(BukkitSource source) {
        if (source.isConsole()) {
            source.error("This command can only be used by players!");
            return;
        }
        
        Player player = source.as(Player.class);
        double balance = economyService.getBalance(player.getUniqueId());
        source.reply("Your balance: $" + balance);
    }
    
    @Usage
    public void checkOtherBalance(BukkitSource source, @Named("player") Player target) {
        double balance = economyService.getBalance(target.getUniqueId());
        source.reply(target.getName() + "'s balance: $" + balance);
    }
}
```

## Advanced Usage

### Constructor Injection

You can also inject dependencies through constructor parameters:

```java
@Command("admin")
@Permission("admin.command")
public final class AdminCommand {
    
    private final PlayerManager playerManager;
    private final EconomyService economyService;
    
    public AdminCommand(@Dependency PlayerManager playerManager, 
                       @Dependency EconomyService economyService) {
        this.playerManager = playerManager;
        this.economyService = economyService;
    }
    
    @Usage
    public void giveMoney(BukkitSource source, @Named("player") Player target, @Named("amount") double amount) {
        economyService.addBalance(target.getUniqueId(), amount);
        source.reply("Added $" + amount + " to " + target.getName());
    }
}
```

### Method Parameter Injection

Dependencies can also be injected as method parameters:

```java
@Command("stats")
public final class StatsCommand {
    
    @Usage
    public void showStats(BukkitSource source, @Dependency PlayerManager playerManager) {
        PlayerStats stats = playerManager.getStats(source.as(Player.class).getUniqueId());
        source.reply("Kills: " + stats.getKills() + ", Deaths: " + stats.getDeaths());
    }
}
```

## Dependency Registration Methods

### Simple Registration

Register a dependency with a simple supplier:

```java
.dependencyResolver(MyService.class, () -> myServiceInstance)
```

### Conditional Registration

Register dependencies based on conditions:

```java
.dependencyResolver(AdvancedFeature.class, () -> {
    if (config.isAdvancedFeaturesEnabled()) {
        return new AdvancedFeature();
    }
    return new BasicFeature();
})
```

### Lazy Initialization

Register dependencies that are initialized on first use:

```java
.dependencyResolver(ExpensiveService.class, () -> {
    if (expensiveService == null) {
        expensiveService = new ExpensiveService();
    }
    return expensiveService;
})
```

## Real-World Example

Here's a comprehensive example showing dependency injection in a rank management system:

```java
// Service classes
public class RankManager {
    private final Map<String, Rank> ranks = new HashMap<>();
    
    public void createRank(String name) {
        ranks.put(name, new Rank(name));
    }
    
    public Rank getRank(String name) {
        return ranks.get(name);
    }
    
    public boolean hasRank(String name) {
        return ranks.containsKey(name);
    }
}

public class PermissionManager {
    private final Map<UUID, Set<String>> permissions = new HashMap<>();
    
    public void addPermission(UUID playerId, String permission) {
        permissions.computeIfAbsent(playerId, k -> new HashSet<>()).add(permission);
    }
    
    public boolean hasPermission(UUID playerId, String permission) {
        return permissions.getOrDefault(playerId, Set.of()).contains(permission);
    }
}

// Command using dependency injection
@Command("rank")
@Permission("rank.admin")
@Description("Rank management system")
public final class RankCommand {
    
    @Dependency
    private RankManager rankManager;
    
    @Dependency
    private PermissionManager permissionManager;
    
    @Usage
    @Description("Create a new rank")
    public void createRank(BukkitSource source, @Named("name") String rankName) {
        if (rankManager.hasRank(rankName)) {
            source.error("Rank '" + rankName + "' already exists!");
            return;
        }
        
        rankManager.createRank(rankName);
        source.reply("Created rank: " + rankName);
    }
    
    @Usage
    @Description("Give a rank to a player")
    public void giveRank(BukkitSource source, @Named("player") Player player, @Named("rank") String rankName) {
        Rank rank = rankManager.getRank(rankName);
        if (rank == null) {
            source.error("Rank '" + rankName + "' does not exist!");
            return;
        }
        
        // Add rank permissions to player
        for (String permission : rank.getPermissions()) {
            permissionManager.addPermission(player.getUniqueId(), permission);
        }
        
        source.reply("Gave rank '" + rankName + "' to " + player.getName());
    }
    
    @Usage
    @Description("Check if player has permission")
    public void checkPermission(BukkitSource source, @Named("player") Player player, @Named("permission") String permission) {
        boolean hasPermission = permissionManager.hasPermission(player.getUniqueId(), permission);
        source.reply(player.getName() + " has permission '" + permission + "': " + hasPermission);
    }
}

// Plugin main class
public class RankPlugin extends JavaPlugin {
    
    private BukkitImperat imperat;
    private RankManager rankManager;
    private PermissionManager permissionManager;
    
    @Override
    public void onEnable() {
        // Initialize services
        rankManager = new RankManager();
        permissionManager = new PermissionManager();
        
        // Register dependencies
        imperat = BukkitImperat.builder(this)
            .dependencyResolver(RankManager.class, () -> rankManager)
            .dependencyResolver(PermissionManager.class, () -> permissionManager)
            .build();
        
        // Register command
        imperat.registerCommand(new RankCommand());
    }
}
```

## Best Practices

### 1. Service Design

- **Single Responsibility**: Each service should have a single, well-defined purpose
- **Interface Segregation**: Use interfaces to define service contracts
- **Dependency Inversion**: Depend on abstractions, not concrete implementations
- **Using Inner non-static subcommand classes:** This will allow your inner subcommands to share the dependencies from your root/parent class.

### 2. Registration

- **Register Early**: Register dependencies during plugin initialization
- **Use Meaningful Names**: Use descriptive class names for better readability
- **Handle Null Cases**: Ensure your services handle null or missing dependencies gracefully

### 3. Usage

- **Minimize Dependencies**: Only inject what you actually need
- **Avoid Circular Dependencies**: Be careful not to create dependency cycles
- **Use Constructor Injection**: Prefer constructor injection for required dependencies
- **Use Field Injection**: Use field injection for optional or frequently changing dependencies

### 4. Performance

- **Lazy Loading**: Use lazy initialization for expensive services
- **Caching**: Cache frequently accessed data within your services
- **Thread Safety**: Ensure your services are thread-safe if used in async contexts

## Error Handling

When a dependency cannot be resolved, Imperat will throw a `UnknownDependencyException`, A dependency fails to be resolved when the 
returned value from its dependency resolver is `null`(by-default even without a dependency-resolver).

Make sure to register A dependency resolver for all of  your dependency fields
in your command class.

## Advanced Patterns

### Factory Pattern

```java
.dependencyResolver(PlayerService.class, () -> {
    return new PlayerServiceFactory().createService(config.getDatabaseType());
})
```

### Singleton Pattern

```java
.dependencyResolver(DatabaseService.class, () -> DatabaseService.getInstance())
```

### Configuration-Based Registration

```java
.dependencyResolver(FeatureService.class, () -> {
    if (config.isFeatureEnabled("advanced")) {
        return new AdvancedFeatureService();
    } else {
        return new BasicFeatureService();
    }
})
```

Dependency injection in Imperat makes your commands more modular, testable, and maintainable. By separating concerns and using proper dependency management, you can create complex command systems that are easy to understand and extend. 