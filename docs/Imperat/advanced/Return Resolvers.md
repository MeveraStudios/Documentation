---
sidebar_position: 9
---

# Return Resolvers

Return Resolvers allow you to handle values returned from command methods that don't return `void`. This is useful when you want your annotated command methods to return meaningful data and have that data processed in a specific way after the command executes.

## What are Return Resolvers?

Normally, command methods return `void` because they handle their own output (like sending messages to players). However, sometimes you want command methods to return data that should be processed in a standardized way across your plugin.

**Common use cases:**
- **Status messages**: Commands return success/failure messages
- **Data objects**: Commands return player stats, configuration data, etc.
- **Validation results**: Commands return validation outcomes
- **API responses**: Commands return data to be formatted consistently

## How Return Resolvers Work

When a command method returns a non-void value, Imperat looks for a registered `ReturnResolver` that matches the return type. The resolver then handles that returned value appropriately.

## Simple Example

Let's start with a basic example that returns simple messages:

### 1. Create the Return Resolver

```java
public class StringReturnResolver extends BaseReturnResolver<BukkitSource, String> {
    
    public StringReturnResolver() {
        super(String.class);
    }
    
    @Override
    public void handle(ExecutionContext<BukkitSource> context, MethodElement method, String message) {
        context.source().reply("&a" + message);
    }
}
```

### 2. Create the Command

```java
@Command("time")
public class TimeCommand {
    
    @Usage
    @Description("Get current server time")
    public String getCurrentTime(BukkitSource source) {
        return "Current server time: " + new Date().toString();
    }
}
```

### 3. Register Everything

```java
BukkitImperat imperat = BukkitImperat.builder(plugin)
    .returnResolver(String.class, new StringReturnResolver())
    .build();

imperat.registerCommand(new TimeCommand());
```

## Complex Example

Now let's look at a more complex example with custom data objects and collections:

### 1. Create the Data Classes

```java
public class ServerReport {
    private final String serverName;
    private final int onlinePlayers;
    private final double tps;
    private final long memoryUsed;
    private final List<String> activeWorlds;
    private final Map<String, Integer> playersByWorld;
    
    public ServerReport(String serverName, int onlinePlayers, double tps, 
                       long memoryUsed, List<String> activeWorlds, 
                       Map<String, Integer> playersByWorld) {
        this.serverName = serverName;
        this.onlinePlayers = onlinePlayers;
        this.tps = tps;
        this.memoryUsed = memoryUsed;
        this.activeWorlds = activeWorlds;
        this.playersByWorld = playersByWorld;
    }
    
    // Getters
    public String getServerName() { return serverName; }
    public int getOnlinePlayers() { return onlinePlayers; }
    public double getTps() { return tps; }
    public long getMemoryUsed() { return memoryUsed; }
    public List<String> getActiveWorlds() { return activeWorlds; }
    public Map<String, Integer> getPlayersByWorld() { return playersByWorld; }
}

public class ReportSummary {
    private final List<ServerReport> reports;
    private final String generatedAt;
    
    public ReportSummary(List<ServerReport> reports) {
        this.reports = reports;
        this.generatedAt = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
    }
    
    public List<ServerReport> getReports() { return reports; }
    public String getGeneratedAt() { return generatedAt; }
}
```

### 2. Create the Return Resolvers

```java
// Single server report resolver
public class ServerReportReturnResolver extends BaseReturnResolver<BukkitSource, ServerReport> {
    
    public ServerReportReturnResolver() {
        super(ServerReport.class);
    }
    
    @Override
    public void handle(ExecutionContext<BukkitSource> context, MethodElement method, ServerReport report) {
        BukkitSource source = context.source();
        
        source.reply("&6=== Server Report: " + report.getServerName() + " ===");
        source.reply("&eOnline Players: &f" + report.getOnlinePlayers());
        source.reply("&eTPS: &f" + String.format("%.2f", report.getTps()));
        source.reply("&eMemory Used: &f" + (report.getMemoryUsed() / 1024 / 1024) + " MB");
        source.reply("&eActive Worlds: &f" + String.join(", ", report.getActiveWorlds()));
        
        source.reply("&ePlayer Distribution:");
        for (Map.Entry<String, Integer> entry : report.getPlayersByWorld().entrySet()) {
            source.reply("  &7- &f" + entry.getKey() + "&7: &a" + entry.getValue() + " players");
        }
        source.reply("&6" + "=".repeat(40));
    }
}

// Report summary resolver using TypeWrap for complex generic type
public class ReportSummaryReturnResolver extends BaseReturnResolver<BukkitSource, ReportSummary> {
    
    public ReportSummaryReturnResolver() {
        super(ReportSummary.class);
    }
    
    @Override
    public void handle(ExecutionContext<BukkitSource> context, MethodElement method, ReportSummary summary) {
        BukkitSource source = context.source();
        
        source.reply("&6=== Network Report Summary ===");
        source.reply("&eGenerated at: &f" + summary.getGeneratedAt());
        source.reply("&eServers analyzed: &f" + summary.getReports().size());
        
        int totalPlayers = summary.getReports().stream()
            .mapToInt(ServerReport::getOnlinePlayers)
            .sum();
        
        double avgTps = summary.getReports().stream()
            .mapToDouble(ServerReport::getTps)
            .average()
            .orElse(0.0);
        
        source.reply("&eTotal Network Players: &a" + totalPlayers);
        source.reply("&eAverage TPS: &b" + String.format("%.2f", avgTps));
        
        source.reply("&eServer Performance:");
        for (ServerReport report : summary.getReports()) {
            String status = report.getTps() >= 19.0 ? "&aGOOD" : 
                          report.getTps() >= 15.0 ? "&eOKAY" : "&cPOOR";
            source.reply("  &7- &f" + report.getServerName() + 
                        "&7: " + status + " &7(" + String.format("%.1f", report.getTps()) + " TPS)");
        }
        source.reply("&6" + "=".repeat(35));
    }
}
```

### 3. Create the Commands

```java
@Command("report")
public class ReportCommand {
    
    private final ServerMonitor monitor;
    
    public ReportCommand(ServerMonitor monitor) {
        this.monitor = monitor;
    }
    
    @Usage
    @Description("Get current server report")
    public ServerReport getCurrentReport(BukkitSource source) {
        return monitor.generateCurrentReport();
    }
    
    @SubCommand("summary")
    @Description("Get network-wide summary report")
    @Permission("report.network")
    public ReportSummary getNetworkSummary(BukkitSource source) {
        List<ServerReport> allReports = monitor.getAllServerReports();
        return new ReportSummary(allReports);
    }
    
    @SubCommand("server")
    @Description("Get report for specific server")
    public ServerReport getServerReport(BukkitSource source, @Named("server") String serverName) {
        return monitor.getServerReport(serverName);
    }
}
```

### 4. Register Everything

```java
BukkitImperat imperat = BukkitImperat.builder(plugin)
    .returnResolver(String.class, new StringReturnResolver())
    .returnResolver(ServerReport.class, new ServerReportReturnResolver())
    .returnResolver(ReportSummary.class, new ReportSummaryReturnResolver())
    .build();

imperat.registerCommand(new TimeCommand());
imperat.registerCommand(new ReportCommand(serverMonitor));
```

## Key Benefits

### **1. Separation of Concerns**
- Command logic focuses on **data retrieval/processing**
- Return resolvers handle **presentation/formatting**
- Clean separation between business logic and UI

### **2. Consistency**
- All commands returning the same type use the same formatting
- Consistent user experience across your plugin
- Easy to change formatting in one place

### **3. Reusability**
- One resolver can handle returns from multiple commands
- Easy to create generic resolvers for common types
- Reduces code duplication

### **4. Flexibility**
- Different return types can have different handling strategies
- Easy to add new return types and their resolvers
- Can handle complex objects and collections

## Best Practices

### **1. Keep Resolvers Simple**
```java
// Good - focused responsibility
public class StringReturnResolver extends BaseReturnResolver<BukkitSource, String> {
    
    public StringReturnResolver() {
        super(String.class);
    }
    
    @Override
    public void handle(ExecutionContext<BukkitSource> context, MethodElement method, String message) {
        context.source().reply("&a" + message);
    }
}
```

### **2. Use Meaningful Return Types**
```java
// Good - specific return type
public String getTime(BukkitSource source) {
    return "Current time: " + new Date();
}

// Avoid - too generic
public Object getTime(BukkitSource source) {
    return new Date();
}
```

### **3. Handle Null Values**
```java
@Override
public void handle(ExecutionContext<BukkitSource> context, MethodElement method, ServerReport report) {
    if (report == null) {
        context.source().reply("&cNo server report available.");
        return;
    }
    
    // Normal handling...
}
```

:::tip When to Use Return Resolvers
Return resolvers are perfect when you want to:
- Standardize output formatting across multiple commands
- Separate business logic from presentation logic
- Handle complex data objects consistently
- Create reusable formatting components
:::

:::warning Important Notes
- Commands that return `void` won't trigger any return resolvers
- Make sure to register resolvers before registering commands
- Return resolvers are called **after** the command method completes successfully
- If no resolver is found for a return type, the returned value is ignored
:::
